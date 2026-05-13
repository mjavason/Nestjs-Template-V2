import { DecodedTokenType } from '@/common/middleware/types/decoded-token.type';
import { User, UserDocumentType } from '@common/models/user/user.schema';
import { UserStatusEnum } from '@common/types/user/user.enum';
import configuration from '@configs/configuration';
import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Model } from 'mongoose';

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
    let decoded = null;

    try {
      decoded = verify(token, configuration().JWT_SECRET) as DecodedTokenType;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userModel.findById(decoded.sub);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.status === UserStatusEnum.INACTIVE)
      throw new ForbiddenException('User account is disabled');

    req['user'] = user;
    next();
  }
}
