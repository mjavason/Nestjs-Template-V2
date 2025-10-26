import { RoleSchema } from '@common/models/user/role.schema';
import { UserSchema } from '@common/models/user/user.schema';
import configuration from '@configs/configuration';
import { SCHEMA_KEYS } from '@configs/constants/constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(configuration().DATABASE_URL),
    MongooseModule.forFeature([
      { name: SCHEMA_KEYS.ROLE, schema: RoleSchema },
      { name: SCHEMA_KEYS.USER, schema: UserSchema },
    ]),
  ],
})
export class SeedModule {}
