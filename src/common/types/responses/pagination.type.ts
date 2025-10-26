import { ApiProperty } from '@nestjs/swagger';

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export class PaginationDto implements PaginationType {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 1 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  totalCount: number;

  @ApiProperty({ example: false })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ example: null, nullable: true })
  nextPage: number | null;

  @ApiProperty({ example: null, nullable: true })
  previousPage: number | null;
}
