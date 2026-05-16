import configuration from '@configs/configuration';
import { AppStageEnum } from '@configs/constants/constants';
import { grafanaLogger } from '@configs/logger/logger.config';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (configuration().APP_STAGE === AppStageEnum.LOCAL)
      console.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | undefined;

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      const msg =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as any).message
          : res;

      if (Array.isArray(msg)) {
        message = msg[0].includes(':')
          ? msg[0].split(':').slice(1).join(':').trim()
          : msg[0];
        errors = msg.map((m) =>
          m.includes(':') ? m.split(':').slice(1).join(':').trim() : m,
        );
      } else {
        message =
          typeof msg === 'string' && msg.includes(':')
            ? msg.split(':').slice(1).join(':').trim()
            : typeof msg === 'string'
              ? msg
              : message;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      const msg =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as any).message
          : res;

      if (Array.isArray(msg)) {
        message = msg[0];
        errors = msg;
      } else {
        message = typeof msg === 'string' ? msg : message;
      }
    } else if (exception instanceof MongooseError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      const mongooseErrors = (exception as any).errors;
      if (mongooseErrors) {
        errors = Object.values(mongooseErrors).map((e: any) => e.message);
      }
    }

    const errorResponse = {
      success: false,
      message,
      ...(errors && { errors }),
    };
    const request = host.switchToHttp().getRequest() as {
      url: string;
      method: string;
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      grafanaLogger.fatal({
        context: HttpExceptionFilter.name,
        message: 'Internal Server Error',
        errorMetadata: {
          apiRoute: request.url,
          method: request.method,
          message: exception.message,
          stack: exception.stack,
        },
      });
    } else {
      grafanaLogger.error({
        context: HttpExceptionFilter.name,
        message: `Error Response [${status}]:`,
        error: errorResponse,
        errorMetadata: {
          apiRoute: request.url,
          method: request.method,
          message: exception.message,
          stack: exception.stack,
        },
      });
    }

    response.status(status).json(errorResponse);
  }
}
