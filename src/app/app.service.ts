import { applyDefaultsToAllModels } from '@/helpers/apply-schema-defaults.helper';
import configuration from '@configs/configuration';
import { AppStageEnum } from '@configs/constants/constants';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const APP_CONFIG = {
  version: '1.0.0',
  appStage: configuration().APP_STAGE,
  name: 'Startup Server',
};

@Injectable()
export class AppService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  getHello() {
    return { message: 'API is live!!!' };
  }

  async applyDBDefaults() {
    if (configuration().APP_STAGE !== AppStageEnum.LOCAL) {
      throw new ForbiddenException(
        'Applying DB defaults is only allowed in local environment',
      );
    }
    await applyDefaultsToAllModels(this.connection);
  }

  async getConfig() {
    return {
      appConfig: APP_CONFIG,
    };
  }
}
