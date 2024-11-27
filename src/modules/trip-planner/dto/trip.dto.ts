import { ApiProperty } from '@nestjs/swagger';
import { Trip, TripsPlaces, TripsTypes } from '@models';

export class TripDto implements Trip {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ enum: TripsTypes })
  type: TripsTypes;

  @ApiProperty({ enum: TripsPlaces })
  origin: TripsPlaces;

  @ApiProperty()
  display_name: string;

  @ApiProperty({ enum: TripsPlaces })
  destination: TripsPlaces;
}
