import { AppService } from '@/app/app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/')
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello() {
    return this.appService.getHello();
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
