import { ApiProperty } from '@nestjs/swagger';
import { ITrip, TripsPlaces, TripsTypes } from '@models';
import { IsEnum, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class TripDto implements ITrip {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({ enum: TripsTypes })
  @IsEnum(TripsTypes)
  type: TripsTypes;

  @ApiProperty({ enum: TripsPlaces })
  @IsEnum(TripsPlaces)
  origin: TripsPlaces;

  @ApiProperty()
  @IsString()
  display_name: string;

  @ApiProperty({ enum: TripsPlaces })
  @IsEnum(TripsPlaces)
  destination: TripsPlaces;
}
