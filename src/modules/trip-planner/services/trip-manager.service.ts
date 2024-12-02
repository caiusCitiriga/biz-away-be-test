import {
  Logger,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { ITrip } from '@models';
import { UserTripsRepoService } from '@repos';

import { UserTripDto } from '../dto/user-trip.dto';

@Injectable()
export class TripManagerService {
  private readonly logger = new Logger(TripManagerService.name);

  constructor(private readonly userTripsRepo: UserTripsRepoService) {}

  async getUserTrips(userId: string): Promise<UserTripDto[]> {
    try {
      return this.userTripsRepo.getByUserId(userId);
    } catch (e) {
      this.logger.debug(`Error getting user trips: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error getting your trips');
    }
  }

  async saveUserTrip(userId: string, trip: ITrip): Promise<UserTripDto> {
    try {
      return this.userTripsRepo.create({ trip, userId });
    } catch (e) {
      this.logger.debug(`Error saving user trip: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error saving your trip');
    }
  }

  async deleteUserTrip(
    savedTripId: string,
    userId: string,
  ): Promise<UserTripDto> {
    try {
      const result = await this.userTripsRepo.deleteUserOwnedTrip(
        savedTripId,
        userId,
      );
      if (!result)
        throw new NotFoundException('Cannot find the trip to delete.');

      return result;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      this.logger.debug(`Error deleting user trip: ${e.message || e.name}`);
      throw new InternalServerErrorException('Error deleting your trip');
    }
  }
}
