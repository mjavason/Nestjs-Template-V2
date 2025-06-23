import { Module } from '@nestjs/common';
import { StartupLoggerService } from './logger.service';

@Module({
  providers: [StartupLoggerService],
  exports: [StartupLoggerService],
})
export class StartupLoggerModule {}
