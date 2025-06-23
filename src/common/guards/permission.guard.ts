import { RoleDocumentType } from '@common/models/user/role.schema';
import { UserDocumentType } from '@common/models/user/user.schema';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const { user } = context.switchToHttp().getRequest() as {
      user: UserDocumentType;
    };
    if (user.isSuper) return true;
    const role = user.role as RoleDocumentType;

    const granted = new Set([
      ...(role?.permissions || []),
      ...(user?.permissions || []),
    ]);

    for (const permission of required) {
      if (!granted.has(permission))
        throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
