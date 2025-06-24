import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { FileType } from '../../../modules/file/types/file.type';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class File implements FileType {
  @Prop()
  author: string;

  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    required: true,
  })
  key: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.Mixed,
  })
  metaData: {
    key: string;
    bucket: string;
    region: string;
    [key: string]: any;
  };
}

export type FileDocumentType = HydratedDocument<FileType>;
export const FileSchema = SchemaFactory.createForClass(File);
