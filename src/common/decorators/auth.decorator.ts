import { PermissionsGuard } from '@common/guards/permission.guard';
import { AnyPermission } from '@common/types/permissions.type';
import { ErrorResponseDTO } from '@common/types/responses/error.type';
import { SimpleSuccessResponseDTO } from '@common/types/responses/success.type';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Auth(permissions: AnyPermission[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(PermissionsGuard),
    ApiBadRequestResponse({ type: ErrorResponseDTO }),
    ApiUnauthorizedResponse({
      type: SimpleSuccessResponseDTO,
    }),
    ApiForbiddenResponse({ type: SimpleSuccessResponseDTO }),
    ApiInternalServerErrorResponse({ type: SimpleSuccessResponseDTO }),
    ApiBearerAuth(),
  );
}

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return user;
  },
);
