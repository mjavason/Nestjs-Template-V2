import { APP_STAGE, ConfigurationKey } from '@configs/constants/constants';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isObjectEmpty } from '@utils/is-object-empty';
import { NextFunction, Request, Response } from 'express';
import {
  generateMinimalRequestContext,
  generateRequestContext,
} from './generate-request-context';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly isRunningLocally =
    this.configService.getOrThrow(ConfigurationKey.APP_STAGE) ===
    APP_STAGE.LOCAL;

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const isHealthEndpoint = req.url.startsWith('/health');
    const requestContext = this.isRunningLocally
      ? generateMinimalRequestContext(req)
      : generateRequestContext(req);

    if (!isHealthEndpoint) {
      log.info({
        message: `Incoming request: ${req.method} ${req.url}`,
        ...requestContext,
        ...((!this.isRunningLocally || !isObjectEmpty(req.body)) && {
          body: req.body,
        }),
      });
    }

    const startedAt = performance.now();

    // Express doesn't provide a way to get the response body, so we monkey-patch res.json to capture it
    // Note: We patch res.json instead of res.send to avoid capturing non-JSON responses
    let responseJson: unknown;
    const resJson = res.json;
    res.json = (body: unknown) => {
      responseJson = body;
      return resJson.call(res, body);
    };

    res.on('close', () => {
      const finishedAt = performance.now();
      const durationMs = finishedAt - startedAt;
      const level = res.statusCode >= 400 ? 'error' : 'info';

      if (!isHealthEndpoint || res.statusCode !== 200) {
        log[level]({
          message: `Finished request: ${req.method} ${req.url} with code ${res.statusCode} in ${Math.trunc(durationMs)}ms`,
          ...requestContext,
          ...(res.statusCode >= 400 && {
            body: responseJson,
          }),
          ...(!this.isRunningLocally && {
            httpCode: res.statusCode,
            duration: durationMs * 1e6, // DD expect nanoseconds
          }),
        });
      }
    });

    return next();
  }
}
