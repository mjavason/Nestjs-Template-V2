import { SystemSettingsType } from '@/modules/system-settings/types/system-settings.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
export class SystemSettingsModel implements SystemSettingsType {
  @Prop({ required: true, default: 'en' })
  language: string;
}

export type SystemSettingsDocumentType = HydratedDocument<SystemSettingsModel>;
export const SystemSettingsSchema =
  SchemaFactory.createForClass(SystemSettingsModel);
