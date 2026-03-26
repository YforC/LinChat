export function createApiError(statusCode, message, type = 'invalid_request_error') {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.type = type;
  return error;
}

export function validateRequestBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createApiError(400, 'Request body must be a JSON object');
  }

  if (!body.model || typeof body.model !== 'string') {
    throw createApiError(400, 'The "model" field is required');
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw createApiError(400, 'The "messages" field must be a non-empty array');
  }
}

export function formatErrorPayload(error) {
  const statusCode = error?.statusCode || error?.status || 500;

  return {
    error: {
      type: error?.type || 'api_error',
      message: error?.message || 'Failed to connect to AI service',
      code: statusCode,
    },
  };
}
