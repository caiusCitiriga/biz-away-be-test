import { Types } from 'mongoose';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IsObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValidObjectId = Types.ObjectId.isValid(value);

    if (!isValidObjectId) throw new BadRequestException('Malformed object id');

    return value;
  }
}
