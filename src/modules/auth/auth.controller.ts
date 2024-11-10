import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithUser } from '../../types/common.type';
import { CustomResponseType } from '../../types/definitions';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { TokenPayload } from './interfaces/token.interface';

// @ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async signIn(@Req() request: RequestWithUser): Promise<CustomResponseType> {
		const { user } = request;

		const result = await this.authService.signIn(user);

		const res: CustomResponseType = {
			message: 'Đăng nhập thành công',
			result,
		};
		return res;
	}

	@UseGuards(JwtRefreshTokenGuard)
	@Post('refresh')
	async refreshAccessToken(@Req() request: RequestWithUser) {
		const { user } = request;

		const payload: TokenPayload = {
			sub: user.id,
		};

		const access_token = this.authService.generateAccessToken(payload);
		const refresh_token = this.authService.generateRefreshToken(payload);
		this.authService.storeRefreshToken(payload.sub, refresh_token);

		const result = { access_token: access_token, refresh_token: refresh_token };

		const res: CustomResponseType = {
			message: 'Refreshed',
			result,
		};

		return res;
	}
}
