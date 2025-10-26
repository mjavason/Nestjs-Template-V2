import configuration from '@configs/configuration';
import { Injectable } from '@nestjs/common';

export const APP_CONFIG = {
  version: '1.0.0',
  appStage: configuration().APP_STAGE,
  name: 'Startup Server',
};

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return { message: 'API is live!!!' };
  }

  async getConfig() {
    return {
      appConfig: APP_CONFIG,
    };
  }
}
