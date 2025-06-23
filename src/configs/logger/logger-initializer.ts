import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';

/**
 * Paths to redact/remove from data while logging
 */
const redactPaths = ['body.password'];

export function initializeLogger() {
  const context = new AsyncLocalStorage();
  Object.defineProperty(global, 'asyncContext', {
    get: () => context.getStore() || context.run.bind(context),
  });

  global.log = pino({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    formatters: { level: (level) => ({ level: level.toUpperCase() }) },
    messageKey: 'message',
    mixin: () => ({
      requestId: asyncContext?.requestId,
    }),
    base: undefined,
    redact: redactPaths, // remove this and make it a file
  });
}
