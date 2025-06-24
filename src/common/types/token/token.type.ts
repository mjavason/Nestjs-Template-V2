import { Types } from 'mongoose';

export type TokenType = {
  userId: string | Types.ObjectId;
  type: string;
  token: string;
  expiresAt: number;
  createdAt?: Date;
};
