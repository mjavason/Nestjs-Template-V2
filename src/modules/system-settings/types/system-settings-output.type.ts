import { ApiProperty } from '@nestjs/swagger';

export class SystemSettingsOutputDto {
  @ApiProperty()
  language: string;
}

export class SystemSettingsSuccessResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: SystemSettingsOutputDto,
  })
  data: SystemSettingsOutputDto;
}
