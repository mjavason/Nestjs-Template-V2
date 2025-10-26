import configuration from '@configs/configuration';
import { APP_NAME, APP_STAGE } from '@configs/constants/constants';
import pino from 'pino';

const localTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
    labels: {
      environment: configuration().APP_STAGE,
    },
  },
  level: 'debug',
};

const onlineTransport = {
  target: 'pino-loki',
  options: {
    batching: true,
    interval: 5,
    host: configuration().LOKI_HOST,
    labels: {
      job: APP_NAME,
      environment: configuration().APP_STAGE,
    },
    basicAuth: {
      username: configuration().LOKI_USERNAME,
      password: configuration().LOKI_BASIC_AUTH,
    },
  },
};

const transports: pino.TransportTargetOptions[] = [];
if (configuration().APP_STAGE === APP_STAGE.LOCAL) {
  // transports.push(localTransport);
} else {
  transports.push(onlineTransport);
}

const logger = pino({
  redact: {
    paths: ['*.password', '*.Password', '*.PASSWORD', 'password'],
    censor: '[Redacted]',
    remove: true,
  },
  transport: {
    targets: transports,
  },
});

export default logger;
