import { ZodType } from 'zod';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private zodType: ZodType) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type == 'body') {
      return this.zodType.parse(value);
    } else {
      return value;
    }
  }
}
