import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

export type UserProjection<T = Partial<UserDocument>> = {
  [Property in keyof T]: 0 | 1;
};

@Injectable()
export class UsersRepoService {
  private readonly defaultProjection: UserProjection = { _id: 0 };

  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const result = await this.model.create(user);
    return result.toJSON();
  }

  async getByUsername(
    username: string,
    projection: UserProjection = this.defaultProjection,
  ): Promise<User | undefined> {
    const result = await this.model.findOne({ username }, projection);
    return result?.toJSON();
  }
}
