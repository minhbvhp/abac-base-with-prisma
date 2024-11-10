import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../interfaces/token.interface';
import { NOT_AUTHORIZED } from '../../../utils/messageConstants';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
		});
	}

	async validate(payload: TokenPayload) {
		const user = await this.usersService.getUserWithRole(payload.sub);
		if (!user) {
			throw new UnauthorizedException(
				NOT_AUTHORIZED,
				'Jwt strategy eror - validate',
			);
		}
		return user;
	}
}
