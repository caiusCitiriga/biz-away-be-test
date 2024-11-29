import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public, ReqUser } from '@core';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in given credentials in exchange for JWT token',
  })
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.username, dto.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns user id',
  })
  getUserInfo(@ReqUser() user: { sub: string }) {
    return user.sub;
  }
}
