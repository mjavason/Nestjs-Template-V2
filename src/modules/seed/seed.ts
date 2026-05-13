import { SeedModule } from '@/modules/seed/seed.module';
import {
  ADMIN_PERMISSIONS,
  USER_PERMISSIONS,
} from '@/modules/user/permissions/user.permission';
import { Role } from '@common/models/user/role.schema';
import { User } from '@common/models/user/user.schema';
import { UserTypeEnum } from '@common/types/user/user.enum';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const RoleModel = app.get(getModelToken(Role.name));
  const UserModel = app.get(getModelToken(User.name));

  let adminRole = await RoleModel.findOne({ name: 'admin' });

  if (!adminRole) {
    adminRole = await RoleModel.create({
      name: 'admin',
      permissions: [
        ...Object.values(USER_PERMISSIONS),
        ...Object.values(ADMIN_PERMISSIONS),
      ],
    });
    console.log('Admin role created');
  } else {
    console.log('Admin role already exists');
  }

  const adminUserExists = await UserModel.exists({
    email: 'testerzero@gmail.com',
  });

  if (!adminUserExists) {
    await UserModel.create({
      firstName: 'Tester',
      lastName: 'Zero',
      email: 'testerzero@gmail.com',
      password: 'Strong@password123',
      userName: 'testerzero',
      isSuper: true,
      roleId: adminRole.id,
      isEmailVerified: true,
      userType: UserTypeEnum.SUPER,
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  await app.close();
}

bootstrap();
