/**
 * Database module currently using mongoose
 */

import configuration from '@configs/configuration';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(configuration().DATABASE_URL)],
})
export class DatabaseModule {}
