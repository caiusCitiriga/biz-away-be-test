import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepoService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const result = await this.model.create(user);
    return result.toJSON();
  }

  async getByUsername(username: string): Promise<User | undefined> {
    const result = await this.model.findOne({ username });
    return result?.toJSON();
  }
}
