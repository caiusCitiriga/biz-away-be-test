import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { ITrip } from '@models';

import { TripDto } from './trip.dto';

export class SaveTripDto {
  @ApiProperty({ type: TripDto })
  @Type(() => TripDto)
  trip: ITrip;
}
