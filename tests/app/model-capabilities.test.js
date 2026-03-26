import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hasCapability,
  normalizeModelCapabilities,
  normalizeModelCatalog,
} from '../../app/utils/modelCapabilities.js';

test('normalizeModelCapabilities preserves explicit capabilities', () => {
  assert.deepEqual(
    normalizeModelCapabilities({
      id: 'gemini-veo',
      capabilities: ['video_generation'],
    }),
    ['video_generation']
  );
});

test('normalizeModelCapabilities derives chat and file capabilities from legacy fields', () => {
  assert.deepEqual(
    normalizeModelCapabilities({
      id: 'gemini-2.5-flash',
      vision: true,
    }),
    ['chat', 'image_understanding', 'file_understanding']
  );
});

test('normalizeModelCatalog adds capabilities to nested model lists', () => {
  const normalized = normalizeModelCatalog([
    {
      category: 'Test',
      models: [{ id: 'gemini-imagen', vision: true }],
    },
  ]);

  assert.deepEqual(normalized[0].models[0].capabilities, [
    'chat',
    'image_understanding',
    'file_understanding',
    'image_generation',
  ]);
});

test('hasCapability handles missing capability arrays safely', () => {
  assert.equal(hasCapability({}, 'video_generation'), false);
});
