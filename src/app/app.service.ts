import { applyDefaultsToAllModels } from '@/helpers/apply-schema-defaults.helper';
import configuration from '@configs/configuration';
import { Injectable } from '@nestjs/common';
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
    await applyDefaultsToAllModels(this.connection);
  }

  async getConfig() {
    return {
      appConfig: APP_CONFIG,
    };
  }
}
