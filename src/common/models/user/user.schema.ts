import { USER_STATUS } from '@common/types/user/user.enum';
import { UserType } from '@common/types/user/user.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from './role.schema';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
  },
})
export class User implements UserType {
  @Prop()
  pictureUrl: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneNumberVerified: boolean;

  @Prop({ select: false })
  password: string;

  @Prop({ unique: true, sparse: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: Role.name })
  role: Types.ObjectId;

  @Prop({ default: USER_STATUS.ACTIVE })
  status: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  username: string;

  @Prop()
  authMethod: string;

  @Prop({ default: false })
  isSuper: boolean;

  @Prop({ default: [] })
  permissions: string[];
}

export type UserDocumentType = HydratedDocument<UserType>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
});

UserSchema.pre('save', async function preSave(next) {
  if (this.isModified('password') || (this.isNew && this.password)) {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
  next();
});
