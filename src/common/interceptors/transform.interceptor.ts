import { SuccessResponseDTO } from '@common/types/responses/success.type';
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
  implements NestInterceptor<T, SuccessResponseDTO>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDTO> {
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
