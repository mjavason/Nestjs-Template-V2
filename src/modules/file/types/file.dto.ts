import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  uploadedFile: any;
}

export class MultiFileUploadDTO {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  uploadedFiles: any[];
}
