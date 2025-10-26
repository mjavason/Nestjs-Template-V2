import { MailService } from '@/modules/mail/services/mail.service';
import { SendMailDTO } from '@/modules/mail/validation/send-simple-mail.validation';
import { Auth } from '@common/decorators/auth.decorator';
import { SimpleSuccessResponseDto } from '@common/types/responses/success.type';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({
    summary: 'Send simple mail to anyone, with base template applied',
  })
  @ApiOkResponse({ type: SimpleSuccessResponseDto })
  @Auth()
  async sendMail(@Body() sendMailDTO: SendMailDTO) {
    this.mailService.sendSimpleMail(sendMailDTO);
    return { message: 'Mail sent successfully!' };
  }
}
