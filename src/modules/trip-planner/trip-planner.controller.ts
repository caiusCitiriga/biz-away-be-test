import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';

import { TripsPlaces } from '@models';
import { ApiListBaseResponseDto } from '@core';

import { TripDto } from './dto/trip.dto';
import { SortModes } from './enum/sort-modes.enum';
import { TripPlannerService } from './services/trip-planner.service';

@ApiBearerAuth()
@ApiTags('Trip planner')
@Controller('trip-planner')
export class TripPlannerController {
  constructor(private readonly tripPlanner: TripPlannerService) {}

  @Get('trips/sorted')
  @ApiListBaseResponseDto(TripDto)
  @ApiQuery({ name: 'sort', enum: SortModes })
  @ApiQuery({ name: 'origin', enum: TripsPlaces })
  @ApiQuery({ name: 'destination', enum: TripsPlaces })
  getSortedTrips(
    @Query('sort', new ParseEnumPipe(SortModes)) sort: SortModes,
    @Query('origin', new ParseEnumPipe(TripsPlaces)) origin: TripsPlaces,
    @Query('destination', new ParseEnumPipe(TripsPlaces))
    destination: TripsPlaces,
  ) {
    return this.tripPlanner.getSortedTrips(origin, destination, sort);
  }
}
