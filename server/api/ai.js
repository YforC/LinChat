import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import {
  formatErrorPayload,
  validateRequestBody,
} from '../utils/aiProxy.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    validateRequestBody(body);

    const config = useRuntimeConfig(event);
    const apiKey = config.openaiApiKey || config.hackclubApiKey || '';
    const baseURL = config.openaiApiBase || 'https://ai.hackclub.com/proxy/v1';

    console.log('Connecting to OpenAI API:', {
      baseURL,
      apiKeyPreview: apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}` : 'missing',
      model: body.model
    });

    const openai = new OpenAI({
      apiKey,
      baseURL,
      defaultHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://google.com/',
        'Origin': 'https://google.com/'
      }
    });

    const {
      stream = true,
      ...rest
    } = body;

    // Log request details for debugging
    console.log('[ai.js] Incoming request:', {
      model: body.model,
      messageCount: body.messages?.length,
      stream,
      hasTools: !!body.tools,
      lastMessageRole: body.messages?.[body.messages.length - 1]?.role,
      lastMessageContentType: typeof body.messages?.[body.messages.length - 1]?.content,
      lastMessageIsArray: Array.isArray(body.messages?.[body.messages.length - 1]?.content)
    });

    // Whitelisted core fields; allow pass-through of others
    const completionParams = {
      ...rest,
      stream
      // rest may include: model, messages, tools, tool_choice,
      // parallel_tool_calls, temperature, top_p, seed, reasoning, plugins, etc.
    };

    if (!stream) {
      const completion = await openai.chat.completions.create({
        ...completionParams,
        stream: false,
      });

      event.node.res.setHeader('Content-Type', 'application/json');
      event.node.res.end(JSON.stringify(completion));
      return;
    }

    // Streaming branch
    const streamResp = await openai.chat.completions.create({
      ...completionParams,
      stream: true,
    });

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    event.node.res.setHeader('Cache-Control', 'no-cache');
    event.node.res.setHeader('Connection', 'keep-alive');
    event.node.res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of streamResp) {
      event.node.res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    event.node.res.write('data: [DONE]\n\n');
    event.node.res.end();

  } catch (error) {
    console.error('Error creating chat completion:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      type: error.type,
      status: error.status,
      stack: error.stack,
      response: error.response?.data
    });

    const errorPayload = formatErrorPayload(error);

    if (body.stream === false) {
      event.node.res.setHeader('Content-Type', 'application/json');
      event.node.res.statusCode = errorPayload.error.code;
      event.node.res.end(JSON.stringify(errorPayload));
    } else {
      event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      event.node.res.setHeader('Cache-Control', 'no-cache');
      event.node.res.setHeader('Connection', 'keep-alive');

      event.node.res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
      event.node.res.write('data: [DONE]\n\n');
      event.node.res.end();
    }
  }
});
