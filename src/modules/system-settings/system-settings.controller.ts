import { SystemSettingsSuccessResponseDto } from '@/modules/system-settings/types/system-settings-output.type';
import { Auth } from '@common/decorators/auth.decorator';
import { SimpleSuccessResponseDto } from '@common/types/responses/success.type';
import { UserTypeEnum } from '@common/types/user/user.enum';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateSystemSettingsDto } from './dtos/update-system-settings.dto';
import { SystemSettingsService } from './system-settings.service';

@Controller('system_settings')
@ApiTags('System Settings')
@ApiOkResponse({ type: SimpleSuccessResponseDto })
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current system settings' })
  @ApiOkResponse({ type: SystemSettingsSuccessResponseDto })
  async getCurrentSettings() {
    return await this.systemSettingsService.getCurrentSettings();
  }

  @Patch()
  @Auth([UserTypeEnum.ADMIN])
  @ApiOperation({ summary: 'Update system settings' })
  async update(@Body() body: UpdateSystemSettingsDto) {
    return await this.systemSettingsService.update(body);
  }

  @Delete()
  @Auth([UserTypeEnum.ADMIN])
  @ApiOperation({ summary: 'Reset system settings' })
  async reset() {
    return await this.systemSettingsService.reset();
  }
}
