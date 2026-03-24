import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../entities/user.entity';

// Custom extractor to read JWT from cookie or Authorization header
const extractJwtFromCookieOrHeader = (req: Request): string | null => {
  // First try to get from HttpOnly cookie
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  }
  // Fallback to Authorization header for backward compatibility
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: 'MULTIBODEGA_SECRET_DEV_KEY_CHANGE_IN_PROD',
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }
    return user; // Disponible globalmente en el scope req.user de NestJS
  }
}
