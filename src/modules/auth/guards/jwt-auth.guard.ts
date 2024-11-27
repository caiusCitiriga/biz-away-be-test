import {
  Logger,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { ENVConfig, IS_PUBLIC_KEY } from '@core';

@Injectable()
export class JwtAuthGuard {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest() as Request;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    if (!this.isAllowedOrigin(req)) return false;
    if (!(await this.isValidToken(req))) return false;

    return true;
  }

  private async isValidToken(req: Request): Promise<boolean> {
    try {
      const tkn = this.extractToken(req);
      await this.jwt.verifyAsync(tkn);
      req['user'] = this.jwt.decode(tkn);
      return true;
    } catch (e) {
      this.logger.debug(`JWT Token verification failed: ${e.message}`);
      return false;
    }
  }

  private extractToken(req: Request): string {
    const tkn = req.headers.authorization;
    if (!tkn) throw new ForbiddenException();
    return tkn.replace('Bearer ', '');
  }

  private isAllowedOrigin(req: Request): boolean {
    const origin = req.get('origin');
    if (!origin && !ENVConfig.acceptUnknownOrigins) {
      this.logger.debug(
        `Refusing to process request coming from unknown origin`,
      );
      return false;
    }

    if (
      !ENVConfig.acceptUnknownOrigins &&
      !ENVConfig.allowedRestOrigins.includes(origin)
    ) {
      this.logger.debug(
        `Refusing to process request coming from [${origin}] origin`,
      );
      return false;
    }

    return true;
  }
}
