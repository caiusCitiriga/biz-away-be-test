import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { BaseResponseInterceptor, ENVConfig } from '@core';

import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { TripPlannerModule } from './modules/trip-planner/trip-planner.module';

@Module({
  imports: [
    MongooseModule.forRoot(ENVConfig.dbUrl, {
      dbName: ENVConfig.dbName,
    }),

    AuthModule,

    TripPlannerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BaseResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
