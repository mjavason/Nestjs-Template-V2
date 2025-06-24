import {
  Injectable,
  LoggerService,
  NotImplementedException,
  Optional,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class StartupLoggerService implements LoggerService {
  private readonly logger: PinoLogger;
  constructor(
    @Optional()
    protected context?: string,
  ) {
    if (!log) {
      throw new NotImplementedException('logger not implemented');
    }
    this.logger = context ? log.child({ context }) : log;
  }
  log(message: any, context?: string): void;
  log(message: any, params?: any, ...optionalParams: any[]): void {
    // Remove redundant logs (such as 'Mapped {/endpoint, POST} route')
    if (
      params === 'RouterExplorer' ||
      params === 'RoutesResolver' ||
      params === 'InstanceLoader'
    ) {
      return;
    }

    if (typeof params === 'string' && optionalParams.length === 0) {
      this.logger.info({ message, context: params });
    } else {
      this.logger.info(
        params instanceof Object ? params : { params },
        // @ts-expect-error -- Keep original Pino usage, even though our types in global.d.ts are stricter
        message,
        optionalParams || {},
      );
    }
  }

  error(message: any, context?: string): void;
  error(message: any, params?: any, ...optionalParams: any[]) {
    if (typeof params === 'string' && optionalParams.length === 0) {
      this.logger.error({ message, context: params });
    } else {
      this.logger.error(
        params instanceof Object ? params : { params },
        // @ts-expect-error -- Keep original Pino usage, even though our types in global.d.ts are stricter
        message,
        optionalParams || {},
      );
    }
  }

  warn(message: any, context?: string): void;
  warn(message: any, params?: any, ...optionalParams: any[]) {
    if (typeof params === 'string' && optionalParams.length === 0) {
      this.logger.warn({ message, context: params });
    } else {
      this.logger.warn(
        params instanceof Object ? params : { params },
        // @ts-expect-error -- Keep original Pino usage, even though our types in global.d.ts are stricter
        message,
        optionalParams || {},
      );
    }
  }
}
