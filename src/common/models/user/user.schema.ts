import { Role } from '@common/models/user/role.schema';
import { USER_STATUS } from '@common/types/user/user.enum';
import { UserType } from '@common/types/user/user.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';

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

  @Prop({ select: false })
  password: string;

  @Prop({ type: Types.ObjectId, ref: Role.name })
  roleId: string;

  @Prop({ default: USER_STATUS.ACTIVE })
  status: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  userName: string;

  @Prop()
  authMethod: string;

  @Prop({ default: false })
  isSuper: boolean;

  @Prop({ default: [] })
  permissions: string[];

  @Prop({ default: false })
  is2FAEnabled: boolean;

  @Prop({ default: false })
  hasActiveSubscription: boolean;

  @Prop({ default: true })
  isAutoSubscriptionEnabled: boolean;
}

export type UserDocumentType = HydratedDocument<UserType>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function preSave(next) {
  if (this.isModified('password') || (this.isNew && this.password)) {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
  next();
});

// Hash on findOneAndUpdate (covers findByIdAndUpdate)
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (update && update.password) {
    const saltOrRounds = 10;
    update.password = await bcrypt.hash(update.password, saltOrRounds);
    this.setUpdate(update);
  }
  next();
});

UserSchema.virtual('role', {
  ref: Role.name,
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});
