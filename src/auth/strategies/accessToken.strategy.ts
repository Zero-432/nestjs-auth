import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  //   async validate(payload): Promise<User> {
  //     const { id } = payload;
  //     const user = await this.userModel.findById(id);
  //     if (!user) {
  //       throw new UnauthorizedException('Login first to access this endpoint.');
  //     }
  //     return user;
  //   }
}
