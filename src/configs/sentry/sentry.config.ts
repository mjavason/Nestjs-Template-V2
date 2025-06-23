import { APP_STAGE } from '@configs/constants/constants';
import { HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentryTracing() {
  /**
   * @todo remove this dsn value from here
   */
  Sentry.init({
    environment: process.env.STAGE,
    dsn: process.env.SENTRY_DNS_URL,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profileSessionSampleRate: 1.0,
    profileLifecycle: 'trace',
    beforeSend(event, hint) {
      const error = hint.originalException;
      if (process.env.APP_STAGE === APP_STAGE.LOCAL) {
        // if local, don't send to sentry
        return null;
      }

      if (error instanceof HttpException) {
        if ([400, 404].includes(error.getStatus())) {
          return null;
        }
      }
      return event;
    },
  });

  Sentry.startSpan({ name: 'Startup Span' }, () => {});
}
