import { User } from '@common/models/user/user.schema';
import { TokenType } from '@common/types/token/token.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Token implements TokenType {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    required: true,
    expires: 86400, // 24 hours in seconds
  })
  expiresAt: number;
}

export type TokenDocumentType = HydratedDocument<TokenType>;
export const TokenSchema = SchemaFactory.createForClass(Token);
