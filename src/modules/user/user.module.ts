import { Role, RoleSchema } from '@common/models/user/role.schema';
import { User, UserSchema } from '@common/models/user/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
('@common/models/user/user.schema');

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
