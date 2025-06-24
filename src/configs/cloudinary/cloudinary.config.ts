import configuration from '@configs/configuration';
import * as cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: configuration().CLOUDINARY_API_NAME,
  api_key: configuration().CLOUDINARY_API_KEY,
  api_secret: configuration().CLOUDINARY_API_SECRET,
});

export const cloudinaryInstance = cloudinary.v2;
