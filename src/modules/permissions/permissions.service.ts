import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
	SUBJECT_ALREADY_EXISTED,
	SUBJECT_NOT_FOUND,
} from '../../utils/messageConstants';
import { SubjectsService } from '../subjects/subjects.service';
import { Permission } from '@prisma/client';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UNIQUE_VIOLATION_CODE } from '../../types/definitions';

@Injectable()
export class PermissionsService {
	constructor(
		private readonly prisma: PrismaService,
		private subjectsService: SubjectsService,
	) {}

	async createPermission(
		createPermissionDto: CreatePermissionDto,
	): Promise<Permission> {
		try {
			const existedSubject = await this.subjectsService.getSubjectById(
				createPermissionDto.subjectId,
			);

			if (!existedSubject) {
				throw new NotFoundException(SUBJECT_NOT_FOUND, {
					cause: new Error('Create permission service not found subject'),
					description: 'Not found',
				});
			}

			const existedPermission = await this.prisma.permission.findUnique({
				where: {
					unique_permission: {
						action: createPermissionDto.action,
						subjectId: createPermissionDto.subjectId,
						condition: createPermissionDto.condition,
					},
				},
			});

			if (!existedPermission) {
				const newPermission = await this.prisma.permission.create({
					data: {
						...createPermissionDto,
					},
				});

				return newPermission;
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async getAllPermissions(): Promise<Permission[]> {
		try {
			const permissions = await this.prisma.permission.findMany({
				include: { subject: true },
			});

			return permissions;
		} catch (error) {
			throw error;
		}
	}

	async getPermissionById(id: number): Promise<Permission> {
		const existedPermission = await this.prisma.permission.findUnique({
			where: {
				id: id,
			},
		});

		if (!existedPermission) {
			return null;
		}

		return existedPermission;
	}

	async updatePermission(
		id: number,
		updatePermissionDto: UpdatePermissionDto,
	): Promise<Permission> {
		try {
			const existedSubject = await this.subjectsService.getSubjectById(
				updatePermissionDto.subjectId,
			);

			if (!existedSubject) {
				throw new NotFoundException(SUBJECT_NOT_FOUND, {
					cause: new Error('Update permission service not found subject'),
					description: 'Not found',
				});
			}

			const existedPermission = await this.prisma.permission.findUnique({
				where: {
					id: id,
				},
			});

			if (existedPermission) {
				const updatedPermission = await this.prisma.permission.update({
					where: {
						id: id,
					},
					data: {
						...updatePermissionDto,
					},
				});

				return updatedPermission;
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

	async deletePermissionPermanently(id: number): Promise<Permission> {
		try {
			const existedPermission = await this.prisma.permission.findUnique({
				where: {
					id: id,
				},
			});

			if (!existedPermission) {
				return null;
			}

			await this.prisma.permission.delete({
				where: {
					id: id,
				},
			});

			return existedPermission;
		} catch (error) {
			throw error;
		}
	}
}
