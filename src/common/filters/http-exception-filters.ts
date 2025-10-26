import configuration from '@configs/configuration';
import { APP_STAGE } from '@configs/constants/constants';
import logger from '@configs/logger/logger.config';
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
  catch(exception: unknown, host: ArgumentsHost) {
    if (configuration().APP_STAGE === APP_STAGE.LOCAL) console.error(exception);

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

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.fatal({
        context: HttpExceptionFilter.name,
        message: 'Internal Server Error',
        error: exception,
      });
    } else {
      logger.error({
        context: HttpExceptionFilter.name,
        message: `Error Response [${status}]:`,
        error: errorResponse,
      });
    }

    response.status(status).json(errorResponse);
  }
}
