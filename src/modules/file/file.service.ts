import { FileDocumentType } from '@/common/models/file/file.schema';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { cloudinaryInstance } from '@configs/cloudinary/cloudinary.config';
import configuration from '@configs/configuration';
import { APP_NAME } from '@configs/constants/constants';
import { s3 } from '@configs/s3/s3.config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocumentType>,
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

  async ensureBucketExists(bucket: string) {
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

  async uploadToS3(filePath: string, folder = 'global', author = '001x') {
    await this.ensureBucketExists(configuration().MINIO_BUCKET);

    const fileContent = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath);
    const fileKey = `${APP_NAME}/${folder}/${uuidv4()}${fileExtension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: configuration().MINIO_BUCKET,
      Key: fileKey,
      Body: fileContent,
      ContentType: this.getMimeType(fileExtension),
      ACL: 'public-read',
    });

    await s3.send(uploadCommand);

    const fileUrl = `${configuration().MINIO_ENDPOINT}/${configuration().MINIO_BUCKET}/${fileKey}`;

    const created = new this.fileModel({
      author,
      url: fileUrl,
      key: fileKey,
      metaData: {
        key: fileKey,
        file: configuration().MINIO_BUCKET,
        region: 'us-east-1',
      },
    });

    return await created.save();
  }

  async deleteFromS3(url: string, author = '001x') {
    const imageUploaded = await this.fileModel.findOne({ url, author });
    if (!imageUploaded) throw new NotFoundException('Upload not found');

    const deleteCommand = new DeleteObjectCommand({
      Bucket: configuration().MINIO_BUCKET,
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

    return await this.fileModel.deleteOne(imageUploaded.id);
  }
}
