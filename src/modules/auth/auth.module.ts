import { AuthController } from '@/modules/auth/controllers/auth.controller';
import { AuthService } from '@/modules/auth/services/auth.service';
import { MailModule } from '@/modules/mail/mail.module';
import { UserModule } from '@/modules/user/user.module';
import { RoleSchema } from '@common/models/user/role.schema';
import { TokenSchema } from '@common/models/user/token.schema';
import { UserSchema } from '@common/models/user/user.schema';
import { SCHEMA_KEYS } from '@configs/constants/constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMA_KEYS.USER, schema: UserSchema },
      { name: SCHEMA_KEYS.ROLE, schema: RoleSchema },
      { name: SCHEMA_KEYS.TOKEN, schema: TokenSchema },
    ]),
    UserModule,
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
