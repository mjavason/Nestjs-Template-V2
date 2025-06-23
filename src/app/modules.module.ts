/**
 * this file contains all root level modules in the application
 */

import { AuthModule } from '@/modules/auth/auth.module';
import { DatabaseModule } from '@/modules/db/database.module';
import { MailModule } from '@/modules/mail/mail.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, MailModule],
})
export class AllSystemModules {}
