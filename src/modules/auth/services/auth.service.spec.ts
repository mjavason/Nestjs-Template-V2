import { AuthService } from '@/modules/auth/services/auth.service';
import { MailService } from '@/modules/mail/services/mail.service';
import {
  BadRequestException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as firebaseAdmin from 'firebase-admin';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'mock-token') }));
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({ verifyIdToken: jest.fn() }),
}));

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  exists: jest.fn(),
};

const mockTokenModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(),
};

const mockMailService = {
  sendSimpleMail: jest.fn(),
};

const mockUser = {
  _id: 'user-id',
  id: 'user-id',
  email: 'user@example.com',
  userName: 'user',
  password: 'hashed-password',
  pictureUrl: '',
  isEmailVerified: false,
  isPhoneNumberVerified: false,
  toObject: jest.fn().mockReturnValue({}),
  save: jest.fn(),
};

const mockTokenDoc = {
  expiresAt: Date.now() + 10000,
  deleteOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: getModelToken('Token'), useValue: mockTokenModel },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('verifyIdToken', () => {
    it('throws for unsupported provider', async () => {
      await expect(
        service.verifyIdToken({
          provider: 'twitter.com',
          token: 'abc',
        } as unknown),
      ).rejects.toThrow(NotImplementedException);
    });

    it('verifies google token successfully', async () => {
      const mockDecoded = {
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'pic.png',
      };
      (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecoded,
      );
      const result = await service.verifyIdToken({
        provider: 'google.com',
        token: 'abc',
      });
      expect(result.email).toBe('john@example.com');
    });

    it('throws if token verification fails', async () => {
      (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('fail'),
      );
      await expect(
        service.verifyIdToken({ provider: 'google.com', token: 'abc' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('socialAuth', () => {
    it('creates user if not found', async () => {
      jest.spyOn(service, 'verifyIdToken').mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        picture: 'pic',
      });
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      const result = await service.socialAuth({
        token: 'abc',
        provider: 'google.com',
      });
      expect(result).toBeDefined();
    });

    it('returns user if already exists', async () => {
      jest.spyOn(service, 'verifyIdToken').mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        picture: 'pic',
      });
      mockUserModel.findOne.mockResolvedValue(mockUser);
      const result = await service.socialAuth({
        token: 'abc',
        provider: 'google.com',
      });
      expect(result).toBeDefined();
    });
  });

  describe('signUpUser', () => {
    it('throws if user exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      await expect(
        service.signUpUser({ email: 'a@gmail.com', password: 'x' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates new user and sends verification', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      jest.spyOn(service, 'sendEmailVerification').mockResolvedValue(undefined);
      const result = await service.signUpUser({
        email: 'a@mail.com',
        password: 'x',
      });
      expect(result).toBeDefined();
    });
  });

  describe('confirmEmail', () => {
    it('throws if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(
        service.confirmEmail({ email: 'a', token: 't' }),
      ).rejects.toThrow();
    });

    it('returns if already verified', async () => {
      mockUser.isEmailVerified = true;
      mockUserModel.findOne.mockResolvedValue(mockUser);
      const result = await service.confirmEmail({ email: 'a', token: 't' });
      expect(result.message).toBe('Email verified successfully');
    });

    it('throws if token not found', async () => {
      mockUser.isEmailVerified = false;
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue(null);
      await expect(
        service.confirmEmail({ email: 'a', token: 't' }),
      ).rejects.toThrow();
    });

    it('throws if token expired', async () => {
      mockUser.isEmailVerified = false;
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue({
        expiresAt: Date.now() - 1000,
      });
      await expect(
        service.confirmEmail({ email: 'a', token: 't' }),
      ).rejects.toThrow();
    });

    it('verifies email on valid token', async () => {
      mockUser.isEmailVerified = false;
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue(mockTokenDoc);
      const result = await service.confirmEmail({ email: 'a', token: 't' });
      expect(result.message).toBe('Email verified successfully');
    });
  });

  describe('login', () => {
    it('throws if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'a', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if password invalid', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.login({ email: 'a', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns token on success', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.login({ email: 'a', password: 'x' });
      expect(result).toHaveProperty('token', 'mock-token');
    });
  });

  describe('forgotPassword', () => {
    it('throws if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(service.forgotPassword({ email: 'a' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates token and sends email', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.create.mockResolvedValue({});
      const result = await service.forgotPassword({ email: 'a' });
      expect(result.message).toBe('Password reset code sent');
    });
  });

  describe('resetPassword', () => {
    it('throws if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(
        service.resetPassword({ email: 'a', token: 't', password: 'x' }),
      ).rejects.toThrow();
    });

    it('throws if token not found or expired', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue(null);
      await expect(
        service.resetPassword({ email: 'a', token: 't', password: 'x' }),
      ).rejects.toThrow();
    });

    it('resets password on valid token', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue(mockTokenDoc);
      mockTokenModel.deleteMany.mockResolvedValue({});
      const result = await service.resetPassword({
        email: 'a',
        token: 't',
        password: 'x',
      });
      expect(result.message).toBe('Password reset successfully');
    });
  });

  describe('isUserNameAvailable', () => {
    it('throws if username exists', async () => {
      mockUserModel.exists.mockResolvedValue(true);
      await expect(service.isUserNameAvailable('a')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns available if not exists', async () => {
      mockUserModel.exists.mockResolvedValue(false);
      const result = await service.isUserNameAvailable('a');
      expect(result.message).toBe('Username available');
    });
  });
});
