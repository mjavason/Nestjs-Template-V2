import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import configuration from '@configs/configuration';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileDocumentType } from './file.schema';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: configuration().MINIO_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: configuration().MINIO_ROOT_USER,
    secretAccessKey: configuration().MINIO_ROOT_PASSWORD,
  },
});

const FILE_NAME = configuration().MINIO_BUCKET;

async function ensureBucketExists(bucket: string) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 404) {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    } else {
      throw err;
    }
  }
}

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocumentType>,
  ) {}

  async uploadToS3(filePath: string, folder = 'global', author = '001x') {
    await ensureBucketExists(FILE_NAME);

    const fileContent = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath);
    const fileKey = `${configuration().APP_NAME}/${folder}/${uuidv4()}${fileExtension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: FILE_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: this.getMimeType(fileExtension),
      ACL: 'public-read',
    });

    await s3.send(uploadCommand);

    const fileUrl = `${configuration().MINIO_ENDPOINT}/${FILE_NAME}/${fileKey}`;

    const created = new this.fileModel({
      author,
      cloudinaryId: fileKey,
      url: fileUrl,
      key: fileKey,
      metaData: {
        key: fileKey,
        file: FILE_NAME,
        region: 'us-east-1',
      },
    });

    return await created.save();
  }

  async deleteFromS3(url: string, author = '001x') {
    const imageUploaded = await this.fileModel.findOne({ url, author });
    if (!imageUploaded) throw new NotFoundException('Upload not found');

    const deleteCommand = new DeleteObjectCommand({
      Bucket: FILE_NAME,
      Key: imageUploaded.metaData.key,
    });

    await s3.send(deleteCommand);

    return await this.fileModel.findByIdAndDelete(imageUploaded.id);
  }

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
}
