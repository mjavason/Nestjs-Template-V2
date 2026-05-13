import { UserTypeGuard } from '@common/guards/user-type.guard';
import { ErrorResponseDto } from '@common/types/responses/error.type';
import { SimpleSuccessResponseDto } from '@common/types/responses/success.type';
import { UserTypeEnum } from '@common/types/user/user.enum';
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

export function Auth(userType: UserTypeEnum[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('userType', userType),
    // UseGuards(PermissionsGuard),
    UseGuards(UserTypeGuard),
    ApiBadRequestResponse({ type: ErrorResponseDto }),
    ApiUnauthorizedResponse({
      type: SimpleSuccessResponseDto,
    }),
    ApiForbiddenResponse({ type: SimpleSuccessResponseDto }),
    ApiInternalServerErrorResponse({ type: SimpleSuccessResponseDto }),
    ApiBearerAuth(),
  );
}

export const UserContextParam = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return user;
  },
);
