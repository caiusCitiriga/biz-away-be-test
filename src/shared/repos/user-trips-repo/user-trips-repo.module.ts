import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserTripsRepoService } from './user-trips-repo.service';
import { UserTrip, UserTripSchema } from './schemas/user-trip.schema';

@Module({
  exports: [UserTripsRepoService],
  imports: [
    MongooseModule.forFeature([
      { name: UserTrip.name, schema: UserTripSchema },
    ]),
  ],
  providers: [UserTripsRepoService],
})
export class UserTripsRepoModule {}
