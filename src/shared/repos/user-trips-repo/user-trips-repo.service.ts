import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserTrip, UserTripDocument } from './schemas/user-trip.schema';

export type UserTripProjection<T = Partial<UserTripDocument>> = {
  [Property in keyof T]: 0 | 1;
};

@Injectable()
export class UserTripsRepoService {
  private readonly defaultProjection: UserTripProjection = { userId: 0 };

  constructor(
    @InjectModel(UserTrip.name) private model: Model<UserTripDocument>,
  ) {}

  async create(userTrip: Omit<UserTrip, 'id'>): Promise<UserTrip> {
    const result = await this.model.findOneAndUpdate(
      { userId: userTrip.userId, 'trip.id': userTrip.trip.id },
      userTrip,
      {
        new: true,
        upsert: true,
        projection: this.defaultProjection,
      },
    );
    return result.toJSON();
  }

  async deleteUserOwnedTrip(
    id: string,
    userId: string,
  ): Promise<UserTrip | null> {
    const result = await this.model.findOneAndDelete({
      userId,
      _id: id,
    });
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
