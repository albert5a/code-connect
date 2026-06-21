import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

export type JwtPayload = { sub: string; email: string; name: string };

export type JwtValidated = { id: string; email: string; name: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: unknown,
      ) => string | null,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'default_jwt_secret',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtValidated> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
