import { ApiProperty } from '@nestjs/swagger';

import { ITrip } from '@models';
import { UserTrip } from '@repos';

import { TripDto } from './trip.dto';

export class UserTripDto implements UserTrip {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: TripDto })
  trip: ITrip;
}
