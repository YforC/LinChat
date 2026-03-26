import test from 'node:test';
import assert from 'node:assert/strict';

import { getCompatibleImageOutput } from '../../app/utils/attachmentImageFormat.js';

test('getCompatibleImageOutput preserves jpeg uploads', () => {
  assert.deepEqual(
    getCompatibleImageOutput({ type: 'image/jpeg', name: 'photo.jpg' }),
    {
      mimeType: 'image/jpeg',
      extension: 'jpg',
      quality: 0.9,
    }
  );
});

test('getCompatibleImageOutput preserves png uploads', () => {
  assert.deepEqual(
    getCompatibleImageOutput({ type: 'image/png', name: 'diagram.png' }),
    {
      mimeType: 'image/png',
      extension: 'png',
      quality: undefined,
    }
  );
});

test('getCompatibleImageOutput converts webp uploads to png', () => {
  assert.deepEqual(
    getCompatibleImageOutput({ type: 'image/webp', name: 'poster.webp' }),
    {
      mimeType: 'image/png',
      extension: 'png',
      quality: undefined,
    }
  );
});
