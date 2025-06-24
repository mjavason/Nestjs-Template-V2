import { Module } from '@nestjs/common';
import { startupLoggerService } from './logger.service';

@Module({
  providers: [startupLoggerService],
  exports: [startupLoggerService],
})
export class startupLoggerModule {}
