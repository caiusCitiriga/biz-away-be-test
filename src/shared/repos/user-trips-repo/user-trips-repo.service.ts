import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserTrip, UserTripDocument } from './schemas/user-trip.schema';

export type UserTripProjection<T = Partial<UserTripDocument>> = {
  [Property in keyof T]: 0 | 1;
};

@Injectable()
export class UserTripsRepoService {
  private readonly defaultProjection: UserTripProjection = { _id: 0 };

  constructor(
    @InjectModel(UserTrip.name) private model: Model<UserTripDocument>,
  ) {}

  async create(trip: UserTrip): Promise<UserTrip> {
    const result = await this.model.create(trip);
    return result.toJSON();
  }

  async deleteUserOwnedTrip(
    id: string,
    userId: string,
  ): Promise<UserTrip | null> {
    const result = await this.model.findOneAndDelete({ id, userId });
    if (!!result) return result.toJSON();

    return null;
  }

  async getByUserId(
    id: string,
    projection: UserTripProjection = this.defaultProjection,
  ): Promise<UserTrip[]> {
    const result = await this.model.find({ userId: id }, projection);
    return result.map((item) => item.toJSON());
  }
}
