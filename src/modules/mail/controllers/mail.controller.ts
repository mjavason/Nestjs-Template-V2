import { Auth } from '@common/decorators/auth.decorator';
import { SimpleSuccessResponseDTO } from '@common/types/responses/success.type';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';
import { SendMailDTO } from '../validation/send-simple-mail.validation';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({
    summary: 'Send simple mail to anyone, with base template applied',
  })
  @ApiOkResponse({ type: SimpleSuccessResponseDTO })
  @Auth()
  async sendMail(@Body() sendMailDTO: SendMailDTO) {
    await this.mailService.sendSimpleMail(sendMailDTO).catch((err) => {
      log.error({
        context: 'MailController#sendMail',
        message: 'Failed to send email',
        error: err,
      });
    });

    return { message: 'Mail sent successfully!' };
  }
}
