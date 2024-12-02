import {
  Logger,
  Injectable,
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { ITrip, TripsPlaces } from '@models';

import { TripDto } from '../dto/trip.dto';
import { SortModes } from '../enum/sort-modes.enum';
import { TripsRemoteApiService } from './trips-remote-api.service';

@Injectable()
export class TripPlannerService {
  private readonly logger = new Logger(TripPlannerService.name);

  constructor(private readonly remoteApi: TripsRemoteApiService) {}

  async getSortedTrips(
    origin: TripsPlaces,
    destination: TripsPlaces,
    sortMode: SortModes,
  ): Promise<TripDto[]> {
    try {
      const tripsList = await this.remoteApi.getTrips(origin, destination);
      const sortedTrips = this.sortTrips(tripsList, sortMode);
      return sortedTrips;
    } catch (e) {
      if (e instanceof BadGatewayException) throw e;

      this.logger.debug(`An unknown error occurred: ${e.message || e.name}`);
      throw new InternalServerErrorException();
    }
  }

  sortTrips(trips: ITrip[], mode: SortModes): ITrip[] {
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
