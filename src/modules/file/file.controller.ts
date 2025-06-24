import { Auth, UserContextParam } from '@common/decorators/auth.decorator';
import { UserDocumentType } from '@common/models/user.schema';
import { upload } from '@configs/multer/multer.config';
import { MulterFileType } from '@configs/multer/multer.type';
import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileUploadDTO, MultiFileUploadDTO } from './types/file.dto';

@Controller('file')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file to the platform bucket',
  })
  @UseInterceptors(FileInterceptor('uploadedFile', upload))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  @Auth()
  async uploadFile(
    @UploadedFile() uploadedFile: MulterFileType,
    @UserContextParam() auth: UserDocumentType,
  ) {
    if (!uploadedFile) throw new BadRequestException('No file uploaded');

    const data = await this.fileService.uploadToS3(
      uploadedFile.path,
      auth.id,
      auth.id,
    );
    return { data: data.url };
  }

  @Post('upload-multiple')
  @ApiOperation({
    summary: 'Upload a group of files',
    description: 'Maximum of 10 at once',
  })
  @UseInterceptors(AnyFilesInterceptor(upload))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MultiFileUploadDTO })
  @Auth()
  async create(
    @UploadedFiles() files: MulterFileType[],
    @UserContextParam() auth: UserDocumentType,
  ) {
    const uploadedFiles = files.filter(
      (file) => file.fieldname === 'uploadedFiles',
    );
    if (uploadedFiles.length < 1)
      throw new BadRequestException('No files uploaded');

    const uploadedFilesArray = await Promise.all(
      uploadedFiles.map(async (file) => {
        const fileUploaded = await this.fileService.uploadToS3(
          file.path,
          auth.id, // folder
          auth.id, // author
        );
        return fileUploaded.url;
      }),
    );

    return uploadedFilesArray;
  }

  @Delete('delete-upload/:url')
  @ApiOperation({
    summary: 'Delete a file uploaded to the platform file',
    description:
      'This removes the file from the file database and from cloudinary itself',
  })
  @Auth()
  async deleteUpload(
    @Param('url') url: string,
    @UserContextParam() auth: UserDocumentType,
  ) {
    return await this.fileService.deleteFromS3(url, auth.id);
  }
}
