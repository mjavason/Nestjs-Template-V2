import { ConfigurationKey } from './constants/constants';

export default () => ({
  [ConfigurationKey.APP_STAGE]: process.env.APP_STAGE,
  [ConfigurationKey.PORT]: process.env.PORT,
  [ConfigurationKey.SENTRY_DNS_URL]: process.env.SENTRY_DNS_URL,
  [ConfigurationKey.DATABASE_URL]:
    process.env.DATABASE_URL ?? 'mongodb://172.18.240.1:27017/startup-dev',
  [ConfigurationKey.JWT_EXPIRY]: process.env.JWT_EXPIRY,
  [ConfigurationKey.JWT_SECRET]: process.env.JWT_SECRET,
  [ConfigurationKey.MAIL_ADDRESS]: process.env.MAIL_ADDRESS,
  [ConfigurationKey.MAIL_PASSWORD]: process.env.MAIL_PASSWORD,
  [ConfigurationKey.MINIO_ROOT_USER]: process.env.MINIO_ROOT_USER,
  [ConfigurationKey.MINIO_ROOT_PASSWORD]: process.env.MINIO_ROOT_PASSWORD,
  [ConfigurationKey.MINIO_ENDPOINT]: process.env.MINIO_ENDPOINT,
  [ConfigurationKey.MINIO_BUCKET]: process.env.MINIO_BUCKET,
  [ConfigurationKey.APP_NAME]: process.env.APP_NAME,
  [ConfigurationKey.CLOUDINARY_API_NAME]: process.env.CLOUDINARY_API_NAME,
  [ConfigurationKey.CLOUDINARY_API_KEY]: process.env.CLOUDINARY_API_KEY,
  [ConfigurationKey.CLOUDINARY_API_SECRET]: process.env.CLOUDINARY_API_SECRET,
});
