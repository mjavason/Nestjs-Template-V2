import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  nextPage: number | null;

  @ApiProperty()
  hasPreviousPage: boolean;
}

export class SimpleSuccessResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Successful' })
  message: string;
}

export class SuccessResponseDto<T> {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Successful' })
  message: string;

  data: T;
}
