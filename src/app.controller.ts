import { AppService } from '@/app/app.service';
import { Auth } from '@common/decorators/auth.decorator';
import { UserTypeEnum } from '@common/types/user/user.enum';
import configuration from '@configs/configuration';
import { AppStageEnum } from '@configs/constants/constants';
import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/')
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello() {
    return this.appService.getHello();
  }

  @Post('apply_db_defaults')
  @Auth([UserTypeEnum.SUPER])
  @ApiOperation({ summary: 'Apply schema defaults to existing documents' })
  @ApiExcludeEndpoint(configuration().APP_STAGE !== AppStageEnum.LOCAL)
  async applyDbDefaults() {
    await this.appService.applyDBDefaults();
    return { message: 'Schema defaults applied successfully' };
  }

  @Get('config')
  @ApiOperation({ summary: 'Get global application configuration' })
  @ApiResponse({
    status: 200,
    description: 'Global configuration retrieved successfully',
  })
  async getConfig() {
    return await this.appService.getConfig();
  }
}
