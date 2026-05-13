import { UserDocumentType } from '@common/models/user/user.schema';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride<string[]>('userType', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const { user } = context.switchToHttp().getRequest() as {
      user: UserDocumentType;
    };
    if (user.isSuper) return true;
    if (required.length === 0) return true;

    if (!required.includes(user.userType)) {
      throw new ForbiddenException('User type not authorized');
    }

    return true;
  }
}
