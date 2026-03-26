import test from 'node:test';
import assert from 'node:assert/strict';

import { PartsBuilder } from '../../app/composables/partsBuilder.js';
import { extractChoiceArtifacts } from '../../app/utils/streamArtifacts.js';

test('extractChoiceArtifacts collects text, images, videos and annotations', () => {
  const artifacts = extractChoiceArtifacts(
    {
      delta: {
        content: '生成完成',
        images: [{ image_url: { url: 'https://example.com/cat.png' } }],
        videos: [{ url: 'https://example.com/cat.mp4' }],
      },
      message: {
        annotations: [{ type: 'file_citation', id: 'ann_1' }],
      },
    },
    {}
  );

  assert.deepEqual(artifacts, {
    text: '生成完成',
    reasoning: null,
    toolCalls: [],
    annotations: [{ type: 'file_citation', id: 'ann_1' }],
    images: [{ image_url: { url: 'https://example.com/cat.png' } }],
    videos: [{ url: 'https://example.com/cat.mp4' }],
  });
});

test('PartsBuilder appendMedia groups images and videos into separate parts', () => {
  const builder = new PartsBuilder();

  builder.appendMedia({
    images: [{ url: 'https://example.com/cat.png' }],
    videos: [{ url: 'https://example.com/cat.mp4' }],
  });

  assert.deepEqual(builder.toArray(), [
    {
      type: 'image',
      images: [{ url: 'https://example.com/cat.png', revised_prompt: null }],
    },
    {
      type: 'video',
      videos: [{ url: 'https://example.com/cat.mp4', mime_type: null }],
    },
  ]);
});
