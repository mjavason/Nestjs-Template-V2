import { UserModule } from '@/modules/user/user.module';
import { Role, RoleSchema } from '@common/models/user/role.schema';
import { User, UserSchema } from '@common/models/user/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      // { name: Token.name, schema: tokenSchema }
    ]),
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
