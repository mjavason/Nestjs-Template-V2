import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  virtuals: true,
})
export class Organization {
  @Prop({ unique: true, searchIndex: true })
  name: string;
}

export type OrganizationDocument = HydratedDocument<Organization>;
