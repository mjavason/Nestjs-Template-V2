import { S3Client } from '@aws-sdk/client-s3';
import configuration from '@configs/configuration';
import { Client } from 'minio';

export const s3 = new S3Client({
  region: configuration().S3_REGION,
  endpoint: configuration().S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: configuration().S3_ROOT_USER,
    secretAccessKey: configuration().S3_ROOT_PASSWORD,
  },
});

const minio = new Client({
  endPoint: configuration().S3_ENDPOINT.replace(/^https?:\/\//, ''),
  port: 443,
  useSSL: true,
  accessKey: configuration().S3_ROOT_USER,
  secretKey: configuration().S3_ROOT_PASSWORD,
  region: configuration().S3_REGION,
});

// For self hosted minio, we need this method to create a public bucket. If you try to use the S3 methods, it fails for some reason...
export async function createMinioPublicBucket(bucket: string) {
  const exists = await minio.bucketExists(bucket);

  if (!exists) {
    await minio.makeBucket(bucket, configuration().S3_REGION);
  }

  await minio.setBucketPolicy(
    bucket,
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    }),
  );
}
