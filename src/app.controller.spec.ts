import { AppController } from '@/app.controller';
import { AppService } from '@/app/app.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return correct message"', () => {
      expect(appController.getHello()).toStrictEqual({
        message: 'API is live!!!',
      });
    });
  });
});
