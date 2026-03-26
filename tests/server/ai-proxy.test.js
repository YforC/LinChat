import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createApiError,
  formatErrorPayload,
  validateRequestBody,
} from '../../server/utils/aiProxy.js';

test('validateRequestBody requires a model string', () => {
  assert.throws(
    () => validateRequestBody({ messages: [{ role: 'user', content: 'hi' }] }),
    (error) => {
      assert.equal(error.message, 'The "model" field is required');
      assert.equal(error.statusCode, 400);
      assert.equal(error.type, 'invalid_request_error');
      return true;
    }
  );
});

test('validateRequestBody requires a non-empty messages array', () => {
  assert.throws(
    () => validateRequestBody({ model: 'gemini-2.5-flash', messages: [] }),
    (error) => {
      assert.equal(error.message, 'The "messages" field must be a non-empty array');
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});

test('validateRequestBody accepts a valid chat completion request', () => {
  assert.doesNotThrow(() => {
    validateRequestBody({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: '你好' }],
    });
  });
});

test('formatErrorPayload normalizes error metadata', () => {
  const payload = formatErrorPayload(createApiError(422, 'Bad payload'));

  assert.deepEqual(payload, {
    error: {
      type: 'invalid_request_error',
      message: 'Bad payload',
      code: 422,
    },
  });
});
