import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { UserTripsRepoModule } from '@repos';

import { TripPlannerController } from './trip-planner.controller';
import { TripPlannerService } from './services/trip-planner.service';
import { TripsRemoteApiService } from './services/trips-remote-api.service';
@Module({
  controllers: [TripPlannerController],
  imports: [HttpModule, UserTripsRepoModule],
  providers: [TripPlannerService, TripsRemoteApiService],
})
export class TripPlannerModule {}
