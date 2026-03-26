import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildUserContent,
  createChatCompletionPayload,
  formatMessageForAPI,
  toFilePart,
  toImagePart,
  toTextPart,
} from '../../app/utils/chatCompletion.js';

test('toTextPart builds a text content block', () => {
  assert.deepEqual(toTextPart('hello'), { type: 'text', text: 'hello' });
});

test('toImagePart builds an image_url content block', () => {
  assert.deepEqual(toImagePart('data:image/png;base64,abc'), {
    type: 'image_url',
    image_url: { url: 'data:image/png;base64,abc' },
  });
});

test('toFilePart converts attachment data URL to file payload', () => {
  assert.deepEqual(
    toFilePart({
      filename: 'doc.pdf',
      dataUrl: 'data:application/pdf;base64,ZmFrZQ==',
    }),
    {
      type: 'file',
      file: {
        filename: 'doc.pdf',
        file_data: 'ZmFrZQ==',
      },
    }
  );
});

test('buildUserContent returns string when no attachments are present', () => {
  assert.equal(buildUserContent('你好', []), '你好');
});

test('buildUserContent creates mixed multimodal parts for images and files', () => {
  assert.deepEqual(
    buildUserContent('读取并总结', [
      {
        type: 'image',
        filename: 'cat.png',
        dataUrl: 'data:image/png;base64,abc',
      },
      {
        type: 'pdf',
        filename: 'doc.pdf',
        dataUrl: 'data:application/pdf;base64,ZmFrZQ==',
      },
    ]),
    [
      { type: 'text', text: '读取并总结' },
      { type: 'image_url', image_url: { url: 'data:image/png;base64,abc' } },
      {
        type: 'file',
        file: {
          filename: 'doc.pdf',
          file_data: 'ZmFrZQ==',
        },
      },
    ]
  );
});

test('formatMessageForAPI preserves assistant image outputs and tool calls', () => {
  assert.deepEqual(
    formatMessageForAPI({
      role: 'assistant',
      parts: [
        { type: 'content', content: '这里是结果' },
        { type: 'image', images: [{ url: 'https://example.com/cat.png' }] },
      ],
      tool_calls: [
        {
          id: 'call_1',
          type: 'function',
          function: { name: 'lookup', arguments: '{"q":"cat"}' },
        },
      ],
    }),
    {
      role: 'assistant',
      content: [
        { type: 'text', text: '这里是结果' },
        { type: 'image_url', image_url: { url: 'https://example.com/cat.png' } },
      ],
      tool_calls: [
        {
          id: 'call_1',
          type: 'function',
          function: { name: 'lookup', arguments: '{"q":"cat"}' },
        },
      ],
    }
  );
});

test('createChatCompletionPayload only includes defined model parameters', () => {
  assert.deepEqual(
    createChatCompletionPayload({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'hello' }],
      stream: true,
      modelParameters: {
        temperature: 0.7,
        top_p: 1,
        seed: undefined,
      },
      plugins: [{ id: 'file-parser' }],
    }),
    {
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'hello' }],
      stream: true,
      temperature: 0.7,
      top_p: 1,
      plugins: [{ id: 'file-parser' }],
    }
  );
});
