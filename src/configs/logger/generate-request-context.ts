import { randomBytes } from 'crypto';
import { Request } from 'express';

function isObjectEmpty(object: unknown): boolean {
  return !object || Object.keys(object).length === 0;
}

export function generateRequestContext(req: Request) {
  return {
    context: 'http',
    method: req.method,
    url: req.url,
    query: req.query,
    requestId: asyncContext.requestId,
    headers: {
      'x-request-id':
        req.headers['x-request-id'] ||
        asyncContext.requestId ||
        randomBytes(12).toString('hex'),
    },
  };
}

/** Use for local purposes only! */
export function generateMinimalRequestContext(req: Request) {
  return {
    ...(!isObjectEmpty(req.query) && { query: req.query }),
    requestId: asyncContext.requestId,
  };
}
