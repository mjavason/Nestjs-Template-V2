import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as os from 'os';
import { extname } from 'path';

const tempDir = os.tmpdir();

const storage = diskStorage({
  destination: function (req, file, callback) {
    callback(null, tempDir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = {
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

export const uploadImages = {
  storage,
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Set the maximum file size to 5 MB
  },
};
