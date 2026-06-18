import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (typeof (value as Record<string, unknown>)[key] === 'string') {
          (value as Record<string, unknown>)[key] = (
            (value as Record<string, unknown>)[key] as string
          ).trim();
        }
      }
    }
    return value;
  }
}
