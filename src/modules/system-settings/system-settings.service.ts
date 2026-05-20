import { SystemSettingsDocumentType } from '@common/models/system-settings/system-settings.schema';
import { SCHEMA_KEYS } from '@configs/constants/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSystemSettingsDto } from './dtos/update-system-settings.dto';
import { transformSystemSettings } from './system-settings.transformer';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectModel(SCHEMA_KEYS.SYSTEM_SETTINGS)
    private readonly systemSettingsModel: Model<SystemSettingsDocumentType>,
  ) {}

  async getCurrentSettings() {
    let doc = await this.systemSettingsModel.findOne().lean();
    if (!doc) doc = await this.systemSettingsModel.create({});

    return {
      data: transformSystemSettings(doc),
    };
  }

  async update(data: UpdateSystemSettingsDto) {
    await this.systemSettingsModel.findOneAndUpdate({}, data);
  }

  async reset() {
    await this.systemSettingsModel.deleteMany({});
    await this.systemSettingsModel.create({});
  }
}
