import { Injectable, NestMiddleware } from '@nestjs/common';
import { setTag } from '@sentry/node';
import { randomBytes } from 'crypto';
import { NextFunction, Request } from 'express';

@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const context = getRequestContext(req);
    setTag('request_id', context.requestId);
    // this code might look complex but its really straight forward.
    // reference here: https://nodejs.org/api/async_context.html#class-asynclocalstorage
    // the next function represents the callback function passed to the run method
    // of the asyncLocalStorage
    asyncContext(context, next);
  }
}

function getRequestContext(req: Request): AsyncContextData {
  return {
    requestId:
      req.headersDistinct['x-request-id']?.at(0) ||
      randomBytes(12).toString('hex'),
    url: req.url,
    query: req.query,
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: req.headers,
  };
}
