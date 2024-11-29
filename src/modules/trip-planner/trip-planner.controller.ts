import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Param,
  Query,
  Delete,
  Controller,
  ParseEnumPipe,
  Body,
} from '@nestjs/common';

import { TripsPlaces } from '@models';
import { ApiBaseResponseDto, ApiListBaseResponseDto, ReqUser } from '@core';

import { TripDto } from './dto/trip.dto';
import { UserTripDto } from './dto/user-trip.dto';
import { SortModes } from './enum/sort-modes.enum';
import { TripPlannerService } from './services/trip-planner.service';
import { IsObjectIdPipe } from 'src/shared/pipes/is-object-id.pipe';

@ApiBearerAuth()
@ApiTags('Trip planner')
@Controller('trip-planner')
export class TripPlannerController {
  constructor(private readonly tripPlanner: TripPlannerService) {}

  @Get('trips')
  @ApiListBaseResponseDto(TripDto)
  @ApiQuery({ name: 'sort_by', enum: SortModes })
  @ApiQuery({ name: 'origin', enum: TripsPlaces })
  @ApiQuery({ name: 'destination', enum: TripsPlaces })
  getSortedTrips(
    @Query('sort_by', new ParseEnumPipe(SortModes)) sort: SortModes,
    @Query('origin', new ParseEnumPipe(TripsPlaces)) origin: TripsPlaces,
    @Query('destination', new ParseEnumPipe(TripsPlaces))
    destination: TripsPlaces,
  ) {
    return this.tripPlanner.getSortedTrips(origin, destination, sort);
  }

  @Post('trips/my-trips')
  @ApiListBaseResponseDto(UserTripDto)
  saveUserTrip(@Body() dto: TripDto, @ReqUser() reqUser: { sub: string }) {
    return this.tripPlanner.saveUserTrip(reqUser.sub, dto);
  }

  @Get('trips/my-trips')
  @ApiListBaseResponseDto(UserTripDto)
  getUserTrips(@ReqUser() reqUser: { sub: string }) {
    return this.tripPlanner.getUserTrips(reqUser.sub);
  }

  @Delete('trips/my-trips/:id')
  @ApiBaseResponseDto(UserTripDto)
  deleteUserTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @ReqUser() reqUser: { sub: string },
  ) {
    return this.tripPlanner.deleteUserTrip(id, reqUser.sub);
  }
}
