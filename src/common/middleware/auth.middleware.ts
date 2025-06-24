import { User, UserDocumentType } from '@common/models/user/user.schema';
import configuration from '@configs/configuration';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { DecodedTokenType } from './types/decoded-token.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer')) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verify(
        token,
        configuration().JWT_SECRET,
      ) as DecodedTokenType;

      const user = await this.userModel.findById(decoded.sub).populate('role');
      if (!user) throw new UnauthorizedException('User not found');

      req['user'] = user;
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
