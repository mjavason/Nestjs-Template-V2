import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { HttpExceptionFilter } from '@common/filters/http-exception-filters';
import { AuthMiddleware } from '@common/middleware/auth.middleware';
import { User, UserSchema } from '@common/models/user.schema';
import configuration from '@configs/configuration';
import { startupLoggerModule } from '@configs/logger/logger.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AllSystemModules } from './modules.module';

@Module({
  imports: [
    SentryModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    startupLoggerModule,
    AllSystemModules,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: SentryGlobalFilter },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/app', method: RequestMethod.ALL },
        // { path: '/auth/(.*)', method: RequestMethod.ALL },
        { path: '/auth/sign_up', method: RequestMethod.POST },
        { path: '/auth/confirm_email', method: RequestMethod.POST },
        { path: '/auth/confirm_phone_number', method: RequestMethod.POST },
        { path: '/auth/sign_in', method: RequestMethod.POST },
        { path: '/auth/forgot_password', method: RequestMethod.POST },
        { path: '/auth/reset_password', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
