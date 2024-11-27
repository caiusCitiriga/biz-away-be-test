import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripPlannerController } from './trip-planner.controller';
import { TripPlannerService } from './services/trip-planner.service';
import { TripsRemoteApiService } from './services/trips-remote-api.service';

@Module({
  imports: [HttpModule],
  controllers: [TripPlannerController],
  providers: [TripPlannerService, TripsRemoteApiService],
})
export class TripPlannerModule {}