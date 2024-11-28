import { randomUUID } from 'crypto';
import {
  Logger,
  Injectable,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { ITrip, TripsPlaces } from '@models';
import { UserTrip, UserTripsRepoService } from '@repos';

import { SortModes } from '../enum/sort-modes.enum';
import { TripsRemoteApiService } from './trips-remote-api.service';

@Injectable()
export class TripPlannerService {
  private readonly logger = new Logger(TripPlannerService.name);

  constructor(
    private readonly remoteApi: TripsRemoteApiService,
    private readonly userTripsRepo: UserTripsRepoService,
  ) {}

  async getSortedTrips(
    origin: TripsPlaces,
    destination: TripsPlaces,
    sortMode: SortModes,
  ): Promise<ITrip[]> {
    try {
      const tripsList = await this.remoteApi.getTrips(origin, destination);
      const sortedTrips = this.sortTrips(tripsList, sortMode);
      return sortedTrips;
    } catch (e) {
      if (e.message === 'unknown remote api error')
        throw new BadGatewayException(e.message);

      throw new BadRequestException(e.message || e.name);
    }
  }

  async getUserTrips(userId: string): Promise<UserTrip[]> {
    try {
      return this.userTripsRepo.getByUserId(userId);
    } catch (e) {
      this.logger.debug(`Error getting user trips: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error getting your trips');
    }
  }

  async saveUserTrip(userId: string, trip: ITrip): Promise<UserTrip> {
    const userTrip: UserTrip = {
      trip,
      userId,
      id: randomUUID(),
    };

    try {
      const result = await this.userTripsRepo.create(userTrip);
      return result;
    } catch (e) {
      this.logger.debug(`Error saving user trip: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error saving your trip');
    }
  }

  async deleteUserTrip(savedTripId: string, userId: string): Promise<UserTrip> {
    try {
      const result = await this.userTripsRepo.deleteUserOwnedTrip(
        savedTripId,
        userId,
      );
      if (!result)
        throw new NotFoundException('Cannot find the trip to delete.');

      return result;
    } catch (e) {
      this.logger.debug(`Error deleting user trip: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error deleting your trip');
    }
  }

  private sortTrips(trips: ITrip[], mode: SortModes): ITrip[] {
    switch (mode) {
      case SortModes.cheapest:
        return trips.sort((a, b) => a.cost - b.cost);
      case SortModes.fastest:
        return trips.sort((a, b) => a.duration - b.duration);
      default:
        throw new BadRequestException(`invalid sort mode "${mode}"`);
    }
  }
}
