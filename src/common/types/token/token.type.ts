export type TokenType = {
  userId: string;
  type: string;
  token: string;
  expiresAt: number;
  createdAt?: Date;
};
