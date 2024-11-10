import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
	EMAIL_NOT_EXISTED,
	EMAIL_OR_PASSWORD_WRONG,
	SERVICE_ERROR_DESCRIPTION,
	THIS_FEATURE_NEED_LOGIN,
} from '../../utils/messageConstants';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { TokenPayload } from './interfaces/token.interface';
import { isUUID } from 'class-validator';
import { UserWithRefreshToken, UserWithRole } from '../prisma/models/User/type';
import { Tokens } from '../../types/common.type';

@Injectable()
export class AuthService {
	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async getAuthenticatedUser(email: string, password: string): Promise<User> {
		try {
			const user = await this.usersService.getUserByEmail(email);

			if (!user) {
				throw new BadRequestException(
					EMAIL_NOT_EXISTED,
					`${SERVICE_ERROR_DESCRIPTION} - get user by email return null`,
				);
			}

			await this.verifyPlainContentWithHashedContent(password, user?.password);
			return user;
		} catch (error) {
			throw error;
		}
	}

	private async verifyPlainContentWithHashedContent(
		plainText: string,
		hashedText: string,
	) {
		const is_matching = await bcrypt.compare(plainText, hashedText);
		if (!is_matching) {
			throw new BadRequestException(
				EMAIL_OR_PASSWORD_WRONG,
				`${SERVICE_ERROR_DESCRIPTION} - verify plain content with hashed content`,
			);
		}
	}

	generateAccessToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
			expiresIn: `${this.configService.get<string>(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	generateRefreshToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
			expiresIn: `${this.configService.get<string>(
				'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	async signIn(user: UserWithRole): Promise<Tokens> {
		try {
			const payload: TokenPayload = {
				sub: user.id,
			};
			const access_token = this.generateAccessToken(payload);
			const refresh_token = this.generateRefreshToken(payload);

			await this.storeRefreshToken(user.id, refresh_token);

			return {
				access_token,
				refresh_token,
			};
		} catch (error) {
			throw error;
		}
	}

	async getUserIfRefreshTokenMatched(
		userId: string,
		refreshToken: string,
	): Promise<UserWithRefreshToken> {
		if (!isUUID(userId)) {
			throw new UnauthorizedException(THIS_FEATURE_NEED_LOGIN);
		}

		try {
			const user = await this.usersService.getUserWithRefreshToken(userId);

			if (!user) {
				throw new UnauthorizedException(THIS_FEATURE_NEED_LOGIN);
			}

			const isRefreshTokenMatched = await this.verifyHashedToken(
				refreshToken,
				user.currentRefreshToken,
			);

			if (!isRefreshTokenMatched) {
				throw new UnauthorizedException(THIS_FEATURE_NEED_LOGIN);
			}

			return user;
		} catch (error) {
			throw error;
		}
	}

	async storeRefreshToken(userId: string, token: string): Promise<void> {
		try {
			const hashedToken = this.hashToken(token);

			await this.usersService.setCurrentRefreshToken(userId, hashedToken);

			return;
		} catch (error) {
			throw error;
		}
	}

	hashToken(plainToken: string) {
		if (!plainToken) {
			return null;
		}
		const salt = this.configService.get<string>('TOKEN_SALT');
		const hashedToken = crypto
			.pbkdf2Sync(plainToken, salt, 10000, 64, 'sha512')
			.toString('hex');

		return hashedToken;
	}

	verifyHashedToken(
		plainToken: string,
		hashedToken: string,
		salt: string = this.configService.get<string>('TOKEN_SALT'),
	): boolean {
		const checkHashed = crypto
			.pbkdf2Sync(plainToken, salt, 10000, 64, 'sha512')
			.toString('hex');

		return hashedToken === checkHashed;
	}

	async getAllPermissionsOfUser(user: User) {
		const permissions = await this.usersService.getPermissionsById(user.id);
		return permissions;
	}
}
