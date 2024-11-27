import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ENVConfig } from '@core';
import { UsersRepoModule } from '@repos';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: ENVConfig.JWTSecret,
      signOptions: { expiresIn: '30d' },
    }),
    UsersRepoModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
