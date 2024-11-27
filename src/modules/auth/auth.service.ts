import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { ENVConfig } from '@core';
import { AuthUtils } from '@utils';
import { UsersRepoService } from '@repos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly usersRepo: UsersRepoService,
  ) {
    this.checkTestUserPresence();
  }

  async signIn(username: string, password: string): Promise<string> {
    const user = await this.usersRepo.getByUsername(username);
    if (!user) throw new UnauthorizedException();

    try {
      const isValidPassword = await AuthUtils.isValidPassword(
        password,
        user.salt,
        user.password,
      );
      if (!isValidPassword) throw new UnauthorizedException();
      return this.jwt.signAsync({ sub: user.username });
    } catch (e) {
      const msg = `Password verify error for "${username}": ${e.message || e.name}`;
      this.logger.debug(msg);
      throw new UnauthorizedException();
    }
  }

  private async checkTestUserPresence() {
    const user = await this.usersRepo.getByUsername(ENVConfig.testUsername);
    if (!user) await this.seedTestUser();
  }

  private async seedTestUser() {
    const salt = await AuthUtils.generateSalt();
    const password = await AuthUtils.hashPassword(ENVConfig.testPassword, salt);
    await this.usersRepo.create({
      salt,
      password,
      username: ENVConfig.testUsername,
    });
    this.logger.debug(`Seeded test user "${ENVConfig.testUsername}"`);
  }
}
