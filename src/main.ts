import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { setupSwagger } from '@configs/swagger/swagger.config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { initializeFirebase } from './configs/firebase/firebase-initializer';
import { initializeLogger } from './configs/logger/logger-initializer';
import { StartupLoggerService } from './configs/logger/logger.service';
import { initializeSentryTracing } from './configs/sentry/sentry.config';

async function bootstrap() {
  initializeSentryTracing();
  initializeLogger();
  initializeFirebase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new StartupLoggerService('app'),
  });

  app.use(helmet());
  app.enableCors();
  app.use(json({ limit: '10mb' }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.enableShutdownHooks();
  const port = process.env.PORT || 3001;

  setupSwagger(app);

  await app.listen(port, async () => {
    log.info({ context: 'app', message: `App listening on :${port}` });
  });
}
bootstrap();
