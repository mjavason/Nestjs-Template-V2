import { AppController } from '@/app.controller';
import { AppService } from '@/app/app.service';
import { AllSystemModules } from '@/app/modules.module';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { HttpExceptionFilter } from '@common/filters/http-exception-filters';
import {
  excludeAll,
  excludeGet,
  excludePost,
} from '@common/helpers/middleware-exclude.helper';
import { AuthMiddleware } from '@common/middleware/auth.middleware';
import { UserSchema } from '@common/models/user/user.schema';
import configuration from '@configs/configuration';
import { SCHEMA_KEYS } from '@configs/constants/constants';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forFeature([{ name: SCHEMA_KEYS.USER, schema: UserSchema }]),
    AllSystemModules,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: SentryGlobalFilter },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        ...excludeAll(['/', '/app', '/role', '/the_odds/(.*)']),
        ...excludePost([
          '/auth/social_auth',
          '/auth/sign_up',
          '/auth/confirm_email',
          '/auth/confirm_phone_number',
          '/auth/sign_in',
          '/auth/forgot_password',
          '/auth/reset_password',
          '/auth/verify_2fa',
          '/auth/request_email_verification',
          '/auth/request_phone_number_verification',
          '/auth/username/(.*)',
        ]),
        ...excludeGet(['/config']),
      )
      .forRoutes('*');
  }
}
