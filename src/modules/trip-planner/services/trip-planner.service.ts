import {
  Injectable,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';

import { Trip, TripsPlaces } from '@models';

import { SortModes } from '../enum/sort-modes.enum';
import { TripsRemoteApiService } from './trips-remote-api.service';

@Injectable()
export class TripPlannerService {
  constructor(private remoteApi: TripsRemoteApiService) {}

  async getSortedTrips(
    origin: TripsPlaces,
    destination: TripsPlaces,
    sortMode: SortModes,
  ) {
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

  private sortTrips(trips: Trip[], mode: SortModes): Trip[] {
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
