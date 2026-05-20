import { SystemSettingsSchema } from '@common/models/system-settings/system-settings.schema';
import { SCHEMA_KEYS } from '@configs/constants/constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemSettingsController } from './system-settings.controller';
import { SystemSettingsService } from './system-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMA_KEYS.SYSTEM_SETTINGS, schema: SystemSettingsSchema },
    ]),
  ],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService],
})
export class SystemSettingsModule {}
