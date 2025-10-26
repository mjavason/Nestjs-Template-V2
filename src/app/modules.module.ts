import { AuthModule } from '@/modules/auth/auth.module';
import { DatabaseModule } from '@/modules/db/database.module';
import { FileModule } from '@/modules/file/file.module';
import { MailModule } from '@/modules/mail/mail.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, MailModule, FileModule],
})
export class AllSystemModules {}
