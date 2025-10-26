import { File } from '@/common/models/file/file.schema';
import { FileService } from '@/modules/file/file.service';
import { cloudinaryInstance } from '@configs/cloudinary/cloudinary.config';
import { s3 } from '@configs/s3/s3.config';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';

jest.mock('@configs/s3/s3.config', () => ({
  s3: {
    send: jest.fn(),
  },
}));

jest.mock('@configs/cloudinary/cloudinary.config', () => ({
  cloudinaryInstance: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));

const mockFileModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteOne: jest.fn(),
  save: jest.fn(),
};

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getModelToken(File.name),
          useValue: mockFileModel,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ensureBucketExists', () => {
    it('should create a bucket if it does not exist', async () => {
      (s3.send as jest.Mock).mockRejectedValueOnce({
        $metadata: { httpStatusCode: 404 },
      });
      await service.ensureBucketExists('test-bucket');
      expect(s3.send).toHaveBeenCalledTimes(2);
    });

    it('should not create a bucket if it already exists', async () => {
      (s3.send as jest.Mock).mockResolvedValueOnce({});
      await service.ensureBucketExists('test-bucket');
      expect(s3.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploadToS3', () => {
    it('should upload a file to S3 and save file data', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('file content');
      (s3.send as jest.Mock).mockResolvedValue({});
      const save = jest.fn().mockResolvedValue({ url: 'file-url' });
      const mockFile = { save };
      (service as any).fileModel = jest.fn(() => mockFile);

      const result = await service.uploadToS3('test.jpg');
      expect(result).toEqual({ url: 'file-url' });
    });
  });

  describe('deleteFromS3', () => {
    it('should delete a file from S3 and remove file data', async () => {
      mockFileModel.findOne.mockResolvedValue({
        id: '1',
        metaData: { key: 'file-key' },
      });
      (s3.send as jest.Mock).mockResolvedValue({});
      mockFileModel.findByIdAndDelete.mockResolvedValue({ id: '1' });

      const result = await service.deleteFromS3('file-url');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if upload not found', async () => {
      mockFileModel.findOne.mockResolvedValue(null);
      await expect(service.deleteFromS3('file-url')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadToCloudinary', () => {
    it('should upload a file to Cloudinary and save file data', async () => {
      (cloudinaryInstance.uploader.upload as jest.Mock).mockResolvedValue({
        public_id: 'public-id',
        secure_url: 'secure-url',
      });
      mockFileModel.create.mockResolvedValue({ url: 'secure-url' });

      const result = await service.uploadToCloudinary('test.jpg');
      expect(result).toEqual({ url: 'secure-url' });
    });
  });

  describe('deleteFromCloudinary', () => {
    it('should delete a file from Cloudinary and remove file data', async () => {
      mockFileModel.findOne.mockResolvedValue({
        id: '1',
        metaData: { public_id: 'public-id' },
      });
      (cloudinaryInstance.uploader.destroy as jest.Mock).mockResolvedValue({});
      mockFileModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteFromCloudinary('file-url');
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('should throw NotFoundException if upload not found', async () => {
      mockFileModel.findOne.mockResolvedValue(null);
      await expect(service.deleteFromCloudinary('file-url')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
