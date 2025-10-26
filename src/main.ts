import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import '@common/utils/ping.util';
import configuration from '@configs/configuration';
import { initializeFirebase } from '@configs/firebase/firebase-initializer';
import { setupSwagger } from '@configs/swagger/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from '@/app/app.module';

async function bootstrap() {
  // console.log('Env test', process.env);
  initializeFirebase();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(json({ limit: '10mb' }));
  app.enableCors({
    origin: (_, callback) => {
      callback(null, true);
    },
  });
  app.useGlobalPipes(new ZodValidationPipe(), new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.enableShutdownHooks();

  const port = configuration().PORT || 3001;

  setupSwagger(app);

  await app.listen(port, async () => {
    console.log(`App listening on :${port}`);
  });
}
bootstrap();
