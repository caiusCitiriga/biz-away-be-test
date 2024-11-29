import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Controller,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { TripsPlaces } from '@models';
import { ApiBaseResponseDto, ApiListBaseResponseDto, ReqUser } from '@core';

import { TripDto } from './dto/trip.dto';
import { UserTripDto } from './dto/user-trip.dto';
import { SortModes } from './enum/sort-modes.enum';
import { IsObjectIdPipe } from 'src/shared/pipes/is-object-id.pipe';
import { TripPlannerService } from './services/trip-planner.service';

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
  @ApiOperation({ summary: 'Gets sorted trips from remote API' })
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
  @ApiOperation({
    summary: 'Upsert a user trip',
    description:
      'If the trip does not exist, a new entry will be created. If the same trip id (remote) exists, the trip will be updated.',
  })
  saveUserTrip(@Body() dto: TripDto, @ReqUser() reqUser: { sub: string }) {
    return this.tripPlanner.saveUserTrip(reqUser.sub, dto);
  }

  @Get('trips/my-trips')
  @ApiListBaseResponseDto(UserTripDto)
  @ApiOperation({ summary: 'Get all user trips' })
  getUserTrips(@ReqUser() reqUser: { sub: string }) {
    return this.tripPlanner.getUserTrips(reqUser.sub);
  }

  @Delete('trips/my-trips/:id')
  @ApiBaseResponseDto(UserTripDto)
  @ApiParam({
    name: 'id',
    description: 'The saved trip internal id. Not the trip remote id.',
  })
  @ApiOperation({
    summary:
      'Delete a trip by internal, not remote id. If owned by the current user.',
    description:
      'If a non existing trip id has been given or the user does not own the given trip, a 404 response will be returned',
  })
  deleteUserTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @ReqUser() reqUser: { sub: string },
  ) {
    return this.tripPlanner.deleteUserTrip(id, reqUser.sub);
  }
}
