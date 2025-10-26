import { MailController } from '@/modules/mail/controllers/mail.controller';
import { MailService } from '@/modules/mail/services/mail.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
