import { S3Client } from '@aws-sdk/client-s3';
import configuration from '@configs/configuration';

export const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: configuration().MINIO_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: configuration().MINIO_ROOT_USER,
    secretAccessKey: configuration().MINIO_ROOT_PASSWORD,
  },
});
