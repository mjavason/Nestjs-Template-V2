/* eslint-disable prettier/prettier */
import { IncomingHttpHeaders } from 'http';
import { Logger } from 'pino';
import { ParsedQs } from 'qs';

declare global {
  interface AsyncContextData {
    method: string;
    url: string;
    query: ParsedQs;
    requestId: string;
    user?: string | undefined;
    ip?: string;
    headers: IncomingHttpHeaders;
    path: string;
  }

  type NonError<T> = T extends Error ? never : T;
  export type LogData = {
    [key: string]: NonError<unknown>;
    message: string;
    err?: unknown;
  };

  export type PinoLogger = Omit<
    Logger,
    'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  > & {
    fatal(logData: LogData): void;
    error(logData: LogData): void;
    warn(logData: LogData): void;
    info(logData: LogData): void;
    debug(logData: LogData): void;
    trace(logData: LogData): void;
  };

  // eslint-disable-next-line no-var
  var log: PinoLogger;

  // eslint-disable-next-line no-var
  var asyncContext: any;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_STAGE: APP_STAGE;
      PORT: number;
      SENTRY_DNS_URL: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_CLIENT_ID: string;
      FIREBASE_AUTH_URI: string;
      FIREBASE_TOKEN_URI: string;
      FIREBASE_AUTH_PROVIDER_CERT_URL: string;
      FIREBASE_CLIENT_CERT_URL: string;
      FIREBASE_UNIVERSAL_DOMAIN: string;
      FIREBASE_TYPE: string;
      DATABASE_URL: string;
      JWT_EXPIRY: string;
      JWT_SECRET: string;
    }
  }
}

export {};
