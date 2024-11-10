import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { NOT_AUTHORIZED } from '../../../utils/messageConstants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string) {
		const user = await this.authService.getAuthenticatedUser(email, password);
		if (!user) {
			throw new UnauthorizedException(
				NOT_AUTHORIZED,
				'Local strategy eror - validate',
			);
		}
		return user;
	}
}
