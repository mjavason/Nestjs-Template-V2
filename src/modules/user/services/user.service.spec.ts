import { UserService } from '@/modules/user/services/user.service';
import { User } from '@common/models/user/user.schema';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

const mockUserModel = {
  findByIdAndUpdate: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValue({});
      const result = await service.updateProfile('user-id', {
        firstName: 'John',
      });
      expect(result.message).toBe('Profile updated');
    });

    it('should throw BadRequestException on error', async () => {
      mockUserModel.findByIdAndUpdate.mockRejectedValue(
        new Error('Update failed'),
      );
      await expect(
        service.updateProfile('user-id', { firstName: 'John' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
