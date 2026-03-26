export function toTextPart(text = '') {
  return {
    type: 'text',
    text,
  };
}

export function toImagePart(url) {
  return {
    type: 'image_url',
    image_url: { url },
  };
}

export function toFilePart(attachment) {
  return {
    type: 'file',
    file: {
      filename: attachment.filename,
      file_data: attachment.dataUrl.split(',')[1],
    },
  };
}

export function buildUserContent(queryText, attachments = []) {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return queryText;
  }

  const contentParts = [toTextPart(queryText)];

  for (const attachment of attachments) {
    if (attachment.type === 'image' && attachment.dataUrl) {
      contentParts.push(toImagePart(attachment.dataUrl));
      continue;
    }

    if (attachment.type === 'pdf' && attachment.dataUrl) {
      contentParts.push(toFilePart(attachment));
    }
  }

  return contentParts;
}

function formatAssistantPart(part, contentParts) {
  switch (part.type) {
    case 'reasoning':
      if (part.content?.trim()) {
        contentParts.push(toTextPart(`<thinking>\n${part.content}\n</thinking>`));
      }
      break;

    case 'content':
      if (part.content?.trim()) {
        contentParts.push(toTextPart(part.content));
      }
      break;

    case 'image':
      if (Array.isArray(part.images)) {
        for (const image of part.images) {
          if (image.url) {
            contentParts.push(toImagePart(image.url));
          }
        }
      }
      break;

    case 'video':
      if (Array.isArray(part.videos)) {
        for (const video of part.videos) {
          if (video.url) {
            contentParts.push(toTextPart(`[Video: ${video.url}]`));
          }
        }
      }
      break;

    case 'tool_group':
      if (Array.isArray(part.tools) && part.tools.length > 0) {
        contentParts.push(toTextPart(
          part.tools.map((tool) => {
            const name = tool.function?.name || 'unknown';
            const hasResult = tool.result !== undefined;
            return `[Tool: ${name}${hasResult ? ' (completed)' : ''}]`;
          }).join('\n')
        ));
      }
      break;
  }
}

export function formatMessageForAPI(msg) {
  const baseMessage = { role: msg.role };

  if (msg.annotations) {
    baseMessage.annotations = msg.annotations;
  }

  if (msg.role === 'user') {
    baseMessage.content = buildUserContent(msg.content || '', msg.attachments || []);
    return baseMessage;
  }

  if (msg.role === 'assistant') {
    if (Array.isArray(msg.parts) && msg.parts.length > 0) {
      const contentParts = [];

      for (const part of msg.parts) {
        formatAssistantPart(part, contentParts);
      }

      if (contentParts.length > 0) {
        const hasNonText = contentParts.some((part) => part.type !== 'text');
        baseMessage.content = hasNonText
          ? contentParts
          : contentParts.map((part) => part.text).join('\n\n');
      } else {
        baseMessage.content = msg.content || '';
      }
    } else {
      let content = msg.content || '';

      if (msg.reasoning?.trim()) {
        content = `<thinking>\n${msg.reasoning}\n</thinking>\n\n${content}`;
      }

      baseMessage.content = content;
    }

    if (Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
      baseMessage.tool_calls = msg.tool_calls.map((toolCall) => ({
        id: toolCall.id,
        type: toolCall.type || 'function',
        function: {
          name: toolCall.function?.name || '',
          arguments: toolCall.function?.arguments || '{}',
        },
      }));
    }

    return baseMessage;
  }

  if (msg.role === 'tool') {
    baseMessage.tool_call_id = msg.tool_call_id;
    baseMessage.name = msg.name;
    baseMessage.content = msg.content || '';
    return baseMessage;
  }

  baseMessage.content = msg.content || '';
  return baseMessage;
}

export function createChatCompletionPayload({
  model,
  messages,
  stream = true,
  modelParameters = {},
  plugins = [],
  tools,
  tool_choice,
}) {
  return {
    model,
    messages,
    stream,
    ...(modelParameters.temperature !== undefined && { temperature: modelParameters.temperature }),
    ...(modelParameters.top_p !== undefined && { top_p: modelParameters.top_p }),
    ...(modelParameters.seed !== undefined && { seed: modelParameters.seed }),
    ...(plugins.length > 0 && { plugins }),
    ...(tools && { tools }),
    ...(tool_choice && { tool_choice }),
  };
}
