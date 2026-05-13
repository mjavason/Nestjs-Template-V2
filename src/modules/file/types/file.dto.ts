import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  uploadedFile: any;
}

export class MultiFileUploadDTO {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  uploadedFiles: any[];
}

export class SingleUploadSignDTO {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  contentType: string;
}

export class MultipartInitDTO {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  contentType: string;
}

export class MultipartSignDTO {
  @ApiProperty()
  key: string;

  @ApiProperty()
  uploadId: string;

  @ApiProperty({ type: 'number' })
  parts: number;
}

export class MultipartSignSingleDTO {
  @ApiProperty()
  key: string;

  @ApiProperty()
  uploadId: string;

  @ApiProperty({ type: 'number' })
  partNumber: number;
}

export class MultipartListDTO {
  @ApiProperty()
  key: string;

  @ApiProperty()
  uploadId: string;
}

export class MultipartCompletePartDTO {
  @ApiProperty()
  ETag: string;

  @ApiProperty({ type: 'number' })
  PartNumber: number;
}

export class MultipartCompleteDTO {
  @ApiProperty()
  key: string;

  @ApiProperty()
  uploadId: string;

  @ApiProperty({ type: [MultipartCompletePartDTO] })
  parts: MultipartCompletePartDTO[];
}
