import { File, FileSchema } from '@/common/models/file/file.schema';
import { FileController } from '@/modules/file/file.controller';
import { FileService } from '@/modules/file/file.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
