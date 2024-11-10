import { ActionType } from '@prisma/client';
import { CreatePermissionDto } from '../../dto/create-permission.dto';
import { UpdatePermissionDto } from '../../dto/update-permission.dto';

export const createPermissionDto: CreatePermissionDto = {
	action: ActionType.read,
	subjectId: 1,
	condition: { userId: '${id}' },
};

export const updatePermissionDto: UpdatePermissionDto = {
	action: ActionType.create,
	subjectId: 1,
	condition: { userId: '${id}' },
};
