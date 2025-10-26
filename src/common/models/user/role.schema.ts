import { RoleType } from '@common/types/user/role.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Role implements RoleType {
  @Prop({ required: true })
  name: string;

  @Prop({
    default: [],
  })
  permissions: string[];
}

export type RoleDocumentType = HydratedDocument<RoleType>;
export const RoleSchema = SchemaFactory.createForClass(Role);
