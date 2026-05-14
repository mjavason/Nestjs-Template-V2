import { FileDocumentType } from '@/common/models/file/file.schema';
import {
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  ListPartsCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cloudinaryInstance } from '@configs/cloudinary/cloudinary.config';
import configuration from '@configs/configuration';
import {
  APP_NAME,
  AppStageEnum,
  SCHEMA_KEYS,
} from '@configs/constants/constants';
import { createMinioPublicBucket, s3 } from '@configs/s3/s3.config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(SCHEMA_KEYS.FILE)
    private readonly fileModel: Model<FileDocumentType>,
  ) {}

  private getMimeType(ext: string): string {
    switch (ext.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  private get bucketName() {
    return configuration().S3_BUCKET;
  }

  private get endpoint() {
    return configuration().S3_ENDPOINT;
  }

  private buildUploadKey(fileName: string) {
    return `uploads/${uuidv4()}-${fileName}`;
  }

  private buildPublicUrl(key: string) {
    return `${this.endpoint}/${this.bucketName}/${key}`;
  }

  // failing for self hosted minio, need to use minio client for that
  private async s3EnsureBucketExists(bucket: string) {
    const exists = await s3.send(new HeadBucketCommand({ Bucket: bucket }));

    if (!exists) {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    }

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };

    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  private async ensureBucketExists(bucket: string) {
    if (configuration().APP_STAGE === AppStageEnum.PRODUCTION) {
      await this.s3EnsureBucketExists(bucket);
    } else {
      await createMinioPublicBucket(bucket);
    }
  }

  async uploadToS3(filePath: string, folder = 'global', author = '001x') {
    await this.ensureBucketExists(this.bucketName);

    const fileContent = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath);
    const fileKey = `${APP_NAME}/${folder}/${uuidv4()}${fileExtension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: this.getMimeType(fileExtension),
      ACL: 'public-read',
    });

    await s3.send(uploadCommand);

    const fileUrl = this.buildPublicUrl(fileKey);

    return await this.fileModel.create({
      author,
      url: fileUrl,
      key: fileKey,
      metaData: {
        key: fileKey,
        file: this.bucketName,
        region: 'us-east-1',
      },
    });
  }

  async deleteFromS3(url: string, author = '001x') {
    const imageUploaded = await this.fileModel.findOne({ url, author });
    if (!imageUploaded) throw new NotFoundException('Upload not found');

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: imageUploaded.metaData.key,
    });

    await s3.send(deleteCommand);

    return await this.fileModel.findByIdAndDelete(imageUploaded.id);
  }

  async uploadToCloudinary(
    path: string,
    folder: string = 'global',
    author: string = '001x',
  ) {
    const imageUpload = await cloudinaryInstance.uploader.upload(path, {
      folder: `${APP_NAME}/${folder}`,
      // resource_type: 'raw',
    });

    return await this.fileModel.create({
      author,
      key: imageUpload.public_id,
      url: imageUpload.secure_url,
      metaData: imageUpload,
    });
  }

  async deleteFromCloudinary(url: string, author: string = '001x') {
    const imageUploaded = await this.fileModel.findOne({ url, author });
    if (!imageUploaded) throw new NotFoundException('Upload not found');

    await cloudinaryInstance.uploader.destroy(imageUploaded.metaData.public_id);

    return await this.fileModel.deleteOne({ _id: imageUploaded.id });
  }

  async getSingleUploadSignedUrl(fileName: string, contentType: string) {
    await this.ensureBucketExists(this.bucketName);

    const key = this.buildUploadKey(fileName);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3 as any, command as any, {
      expiresIn: 60 * 60,
    });

    return {
      message: 'Signed URL generated successfully',
      data: {
        url,
        key,
        publicUrl: this.buildPublicUrl(key),
      },
    };
  }

  async initializeMultipartUpload(fileName: string, contentType: string) {
    await this.ensureBucketExists(this.bucketName);

    const key = this.buildUploadKey(fileName);

    const res = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      }),
    );

    return {
      message: 'Multipart upload initialized successfully',
      data: {
        uploadId: res.UploadId,
        key,
      },
    };
  }

  async signMultipartUploadParts(
    key: string,
    uploadId: string,
    parts: number,
    partNumbers?: number[],
  ) {
    const resolvedPartNumbers =
      partNumbers && partNumbers.length > 0
        ? partNumbers
        : Array.from({ length: parts }, (_, index) => index + 1);

    const urls = await Promise.all(
      resolvedPartNumbers.map(async (partNumber) => {
        const command = new UploadPartCommand({
          Bucket: this.bucketName,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const url = await getSignedUrl(s3 as any, command as any, {
          expiresIn: 60 * 60 * 2,
        });

        return { partNumber, url };
      }),
    );

    return {
      message: 'Signed URLs generated successfully',
      data: { urls },
    };
  }

  async signSingleMultipartUploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
  ) {
    const urls = [];
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    const url = await getSignedUrl(s3 as any, command as any, {
      expiresIn: 60 * 60 * 2,
    });
    urls.push({ partNumber, url });

    return {
      message: 'Signed URLs generated successfully',
      data: { urls },
    };
  }

  async listMultipartUploadParts(key: string, uploadId: string) {
    const res = await s3.send(
      new ListPartsCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
      }),
    );

    const parts = (res.Parts || []).map((part) => ({
      PartNumber: part.PartNumber,
      ETag: part.ETag,
    }));

    return {
      message: 'List of uploaded parts',
      data: { parts },
    };
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ) {
    const res = await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
        },
      }),
    );

    const fileUrl = res.Location || this.buildPublicUrl(key);

    await this.fileModel.create({
      author: '001x',
      url: fileUrl,
      key,
      metaData: {
        key,
        file: this.bucketName,
      },
    });

    return {
      message: 'Multipart upload completed successfully',
      data: { publicUrl: fileUrl },
    };
  }
}
