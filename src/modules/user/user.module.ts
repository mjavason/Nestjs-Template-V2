import { FileModule } from '@/modules/file/file.module';
import { RoleController } from '@/modules/user/controllers/role.controller';
import { UserController } from '@/modules/user/controllers/user.controller';
import { RoleService } from '@/modules/user/services/role.service';
import { UserService } from '@/modules/user/services/user.service';
import { Role, RoleSchema } from '@common/models/user/role.schema';
import { User, UserSchema } from '@common/models/user/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    FileModule,
  ],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
