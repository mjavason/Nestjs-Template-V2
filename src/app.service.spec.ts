import { AppService } from '@/app/app.service';
import { Test, TestingModule } from '@nestjs/testing';

const mockSystemSettingsService = {
  getSettings: jest.fn(),
};

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "API is live!!!"', () => {
      expect(service.getHello()).toEqual({ message: 'API is live!!!' });
    });
  });
});
