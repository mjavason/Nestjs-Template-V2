import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  uploadedFile: any;
}

export class MultiFileUploadDTO {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  uploadedFiles: any[];
}

// import { MulterFileSchema } from '@configs/multer/multer.type';
// import { createZodDto } from '@anatine/zod-nestjs';
// import { z } from 'zod';

// export const FileUploadSchema = z.object({
//   uploadedFile: MulterFileSchema.optional(),
// });

// export const MultiFileUploadSchema = z.object({
//   uploadedFiles: z.array(MulterFileSchema),
// });

// export class FileUploadDTO extends createZodDto(FileUploadSchema) {}
// export class MultiFileUploadDTO extends createZodDto(MultiFileUploadSchema) {}
