import { APP_STAGE, ConfigurationKey } from '@configs/constants/constants';
import 'dotenv/config';

export default () => ({
  [ConfigurationKey.APP_STAGE]: process.env.APP_STAGE ?? APP_STAGE.LOCAL,
  [ConfigurationKey.PORT]: process.env.PORT,
  [ConfigurationKey.SENTRY_DNS_URL]: process.env.SENTRY_DNS_URL,
  [ConfigurationKey.DATABASE_URL]:
    process.env.DATABASE_URL ?? 'mongodb://localhost:27017/startup-dev',
  [ConfigurationKey.BASE_URL]: process.env.BASE_URL,
  [ConfigurationKey.JWT_EXPIRY]: process.env.JWT_EXPIRY,
  [ConfigurationKey.JWT_SECRET]: process.env.JWT_SECRET,
  [ConfigurationKey.MAIL_ADDRESS]: process.env.MAIL_ADDRESS,
  [ConfigurationKey.MAIL_PASSWORD]: process.env.MAIL_PASSWORD,
  [ConfigurationKey.MINIO_ROOT_USER]: process.env.MINIO_ROOT_USER,
  [ConfigurationKey.MINIO_ROOT_PASSWORD]: process.env.MINIO_ROOT_PASSWORD,
  [ConfigurationKey.MINIO_ENDPOINT]: process.env.MINIO_ENDPOINT,
  [ConfigurationKey.MINIO_BUCKET]: process.env.MINIO_BUCKET,
  [ConfigurationKey.CLOUDINARY_API_NAME]: process.env.CLOUDINARY_API_NAME,
  [ConfigurationKey.CLOUDINARY_API_KEY]: process.env.CLOUDINARY_API_KEY,
  [ConfigurationKey.CLOUDINARY_API_SECRET]: process.env.CLOUDINARY_API_SECRET,
  [ConfigurationKey.FIREBASE_PROJECT_ID]: process.env.FIREBASE_PROJECT_ID,
  [ConfigurationKey.FIREBASE_CLIENT_EMAIL]: process.env.FIREBASE_CLIENT_EMAIL,
  [ConfigurationKey.FIREBASE_PRIVATE_KEY]: process.env.FIREBASE_PRIVATE_KEY,
  [ConfigurationKey.NODE_ENV]: process.env.NODE_ENV,
  [ConfigurationKey.REDIS_HOST]: process.env.REDIS_HOST,
  [ConfigurationKey.REDIS_PORT]: parseInt(process.env.REDIS_PORT || '6379', 10),
  [ConfigurationKey.REDIS_PASSWORD]: process.env.REDIS_PASSWORD,
  [ConfigurationKey.LOKI_HOST]: process.env.LOKI_HOST,
  [ConfigurationKey.LOKI_USERNAME]: process.env.LOKI_USERNAME,
  [ConfigurationKey.LOKI_BASIC_AUTH]: process.env.LOKI_BASIC_AUTH,
  [ConfigurationKey.SMTP_BRIDGE_PASSWORD]: process.env.SMTP_BRIDGE_PASSWORD,
});
