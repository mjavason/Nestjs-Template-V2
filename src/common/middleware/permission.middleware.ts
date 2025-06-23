import { RoleDocumentType } from '@common/models/user/role.schema';
import { UserDocumentType } from '@common/models/user/user.schema';
import { USER_PERMISSIONS } from '@configs/constants/permissions/user.permission';
import { ForbiddenException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

//TODO: This introduces unnecessary complexity to the project, currently using a guard
export function PermissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const user = req['user'] as UserDocumentType;
  const key = `${req.method} ${req.originalUrl ?? '/'}`;
  const required: string[] = USER_PERMISSIONS[key] || [];

  const userRole = user.role as RoleDocumentType;
  let hasAccess = required.every((p) => userRole.permissions.includes(p));
  if (!hasAccess) throw new ForbiddenException('Permission denied');

  next();
}
