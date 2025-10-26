import { SuccessResponseDto } from '@common/types/responses/success.type';
import { MESSAGES } from '@configs/constants/messages';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    return next.handle().pipe(
      map((originalData) => {
        const { message, success, data, ...rest } =
          typeof originalData === 'object' && originalData !== null
            ? originalData
            : {};

        const responseData =
          data ?? (Object.keys(rest).length > 0 ? rest : undefined);

        return {
          success: success ?? true,
          message: message ?? MESSAGES.SUCCESSFUL,
          data: responseData,
        };
      }),
    );
  }
}
