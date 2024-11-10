import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UNIQUE_VIOLATION_CODE } from '../../types/definitions';
import {
	HAS_ONE_PERMISSION_NOT_FOUND,
	ROLE_NOT_FOUND,
	SUBJECT_ALREADY_EXISTED,
} from '../../utils/messageConstants';

@Injectable()
export class RolesService {
	constructor(private readonly prisma: PrismaService) {}

	async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
		try {
			const existedRole = await this.prisma.role.findUnique({
				where: {
					name: createRoleDto.name,
				},
			});

			if (!existedRole) {
				const newRole = await this.prisma.role.create({
					data: { ...createRoleDto },
				});

				return newRole;
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async getAllRoles(): Promise<Role[]> {
		try {
			const roles = await this.prisma.role.findMany();

			return roles;
		} catch (error) {
			throw error;
		}
	}

	async getRoleById(id: number): Promise<Role> {
		try {
			const existedRole = await this.prisma.role.findUnique({
				where: {
					id: id,
				},
			});

			return existedRole;
		} catch (error) {
			throw error;
		}
	}

	async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
		try {
			const existedRole = await this.prisma.role.findUnique({
				where: {
					id: id,
				},
			});

			if (existedRole) {
				const updatedRole = await this.prisma.role.update({
					where: {
						id: id,
					},
					data: {
						...updateRoleDto,
					},
				});

				return updatedRole;
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === UNIQUE_VIOLATION_CODE) {
					throw new ConflictException(SUBJECT_ALREADY_EXISTED);
				}
			}

			throw error;
		}

		return null;
	}

	async deleteRolePermanently(id: number): Promise<Role> {
		try {
			const existedRole = await this.prisma.role.findUnique({
				where: {
					id: id,
				},
			});

			if (!existedRole) {
				return null;
			}

			await this.prisma.role.delete({ where: { id: id } });

			return existedRole;
		} catch (error) {
			throw error;
		}
	}

	async grantPermissions(roleId: number, permissionIds: number[]) {
		try {
			const existedRole = await this.prisma.role.findUnique({
				where: {
					id: roleId,
				},
			});

			if (!existedRole) {
				throw new NotFoundException(ROLE_NOT_FOUND);
			}

			const checkAllAsyncPermissions = await Promise.all(
				permissionIds.map(async (permissionId) => {
					return await this.isPermissionAvailable(permissionId);
				}),
			);

			const areAllPermissionAvailable = checkAllAsyncPermissions.every(Boolean);

			if (!areAllPermissionAvailable) {
				throw new NotFoundException(HAS_ONE_PERMISSION_NOT_FOUND);
			}

			await this.prisma.rolesWithPermissions.createMany({
				data: permissionIds.map((permissionId) => ({
					roleId: roleId,
					permissionId: permissionId,
				})),
				skipDuplicates: true,
			});

			return { role_id: roleId, permission_ids: permissionIds };
		} catch (error) {
			throw error;
		}
	}

	private async isPermissionAvailable(permissionId: number): Promise<boolean> {
		const permission = await this.prisma.permission.findUnique({
			where: {
				id: permissionId,
			},
		});

		if (permission) return true;

		return false;
	}
}
