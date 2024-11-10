import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isUUID } from 'class-validator';
import {
	COMPANY_AREA_NOT_FOUND,
	COMPANY_NOT_FOUND,
	GENDER_NOT_FOUND,
	ROLE_ID_MUST_NUMBER,
	ROLE_NOT_FOUND,
	SERVICE_ERROR_DESCRIPTION,
} from '../../utils/messageConstants';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import {
	DefaultUserData,
	UserWithRefreshToken,
	UserWithRole,
} from '../prisma/models/User/type';
import {
	defaultUserSelect,
	userSelectWithRefreshToken,
	userSelectWithRole,
} from '../prisma/models/User/select';

@Injectable()
export class UsersService {
	private saltRounds: number;

	constructor(
		private readonly prisma: PrismaService,
		private readonly rolesService: RolesService,
		private readonly configService: ConfigService,
	) {
		this.saltRounds = this.configService.get('SALT_ROUNDS', 10);
	}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const existedUser = await this.prisma.user.findUnique({
				where: {
					email: createUserDto.email,
				},
			});

			if (!existedUser) {
				const userGender = await this.prisma.gender.findUnique({
					where: {
						id: createUserDto.genderId,
					},
				});

				if (!userGender) {
					throw new BadRequestException(
						GENDER_NOT_FOUND,
						`${SERVICE_ERROR_DESCRIPTION} - create user gender return null`,
					);
				}

				const userRole = await this.rolesService.getRoleById(
					createUserDto.roleId,
				);

				if (!userRole) {
					throw new BadRequestException(
						ROLE_NOT_FOUND,
						`${SERVICE_ERROR_DESCRIPTION} - create user role return null`,
					);
				}

				const userCompany = await this.prisma.company.findUnique({
					where: {
						id: createUserDto.companyId,
					},
				});

				if (!userCompany) {
					throw new BadRequestException(
						COMPANY_NOT_FOUND,
						`${SERVICE_ERROR_DESCRIPTION} - create user company return null`,
					);
				}

				const userCompanyArea = await this.prisma.companyArea.findUnique({
					where: {
						id: createUserDto.companyAreaId,
					},
				});

				if (!userCompanyArea) {
					throw new BadRequestException(
						COMPANY_AREA_NOT_FOUND,
						`${SERVICE_ERROR_DESCRIPTION} - create user company area return null`,
					);
				}

				const hashedPassword = await bcrypt.hash(
					createUserDto.password,
					+this.saltRounds,
				);

				const newUser = await this.prisma.user.create({
					data: {
						...createUserDto,
						password: hashedPassword,
					},
				});

				return { userId: newUser.id };
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async setCurrentRefreshToken(id: string, hashedToken: string): Promise<void> {
		try {
			if (hashedToken) {
				await this.prisma.user.update({
					where: {
						id: id,
					},
					data: {
						currentRefreshToken: hashedToken,
					},
				});
			}
		} catch (error) {
			throw error;
		}
	}

	async getAllUsers(
		current: number = 1,
		total: number = 10,
	): Promise<{ users: DefaultUserData[]; totalPages: number }> {
		try {
			const skip = (current - 1) * total;

			const [users, totalItems] = await Promise.all([
				this.prisma.user.findMany({
					take: total,
					skip: skip,
					select: defaultUserSelect,
				}),
				this.prisma.user.count(),
			]);

			const totalPages = Math.ceil(totalItems / total);

			return { users, totalPages };
		} catch (error) {
			throw error;
		}
	}

	async getUserWithRefreshToken(userId: string): Promise<UserWithRefreshToken> {
		try {
			if (!isUUID(userId)) {
				return null;
			}

			const existedUser = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: userSelectWithRefreshToken,
			});

			if (!existedUser) {
				return null;
			}

			return existedUser;
		} catch (error) {
			throw error;
		}
	}

	async getUserByEmail(email: string): Promise<User> {
		try {
			const existedUser = await this.prisma.user.findUnique({
				where: {
					email: email,
				},
			});

			return existedUser;
		} catch (error) {
			throw error;
		}
	}

	async getUserWithRole(userId: string): Promise<UserWithRole> {
		try {
			if (!isUUID(userId)) {
				return null;
			}

			const userWithRole = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: userSelectWithRole,
			});

			if (!userWithRole) {
				return null;
			}

			return userWithRole;
		} catch (error) {
			throw error;
		}
	}

	async updateUser(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<DefaultUserData> {
		try {
			if (!isUUID(id)) {
				return null;
			}

			const existedUser = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
			});

			if (existedUser) {
				let userRole = await this.rolesService.getRoleById(
					updateUserDto.roleId,
				);

				if (!userRole) {
					throw new BadRequestException(
						ROLE_ID_MUST_NUMBER,
						`${SERVICE_ERROR_DESCRIPTION} - create user return null`,
					);
				}

				const updatedUser = await this.prisma.user.update({
					where: {
						id: existedUser.id,
					},
					data: {
						...updateUserDto,
					},
					select: defaultUserSelect,
				});

				return updatedUser;
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async deleteUserPermanently(id: string): Promise<DefaultUserData> {
		try {
			if (!isUUID(id)) {
				return null;
			}

			const existedUser = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				select: defaultUserSelect,
			});

			if (!existedUser) {
				return null;
			}

			await this.prisma.user.delete({ where: { id: id } });

			return existedUser;
		} catch (error) {
			throw error;
		}
	}

	async getPermissionsById(id: string) {
		try {
			if (!isUUID(id)) {
				return [];
			}

			const existedUser = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				include: {
					role: {
						include: {
							roleWithPermissions: {
								include: {
									permission: {
										include: {
											subject: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!existedUser) {
				return [];
			}

			const result = existedUser.role.roleWithPermissions.map(
				(roleWithPermission) => roleWithPermission.permission,
			);

			return result;
		} catch (error) {
			throw error;
		}
	}
}
