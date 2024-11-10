import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import {
	ACTION_MUST_NOT_EMPTY,
	SUBJECT_ID_MUST_NUMBER,
	SUBJECT_MUST_NOT_EMPTY,
} from '../../../utils/messageConstants';
import { ActionType } from '@prisma/client';

export class UpdatePermissionDto {
	@IsEnum(ActionType, {
		message: () => {
			return `${ACTION_MUST_NOT_EMPTY}. Quyền thao tác chỉ bao gồm: ${Object.values(ActionType).join(', ')}`;
		},
	})
	@IsNotEmpty({ message: ACTION_MUST_NOT_EMPTY })
	action: ActionType;

	@IsNumber({}, { message: SUBJECT_ID_MUST_NUMBER })
	@IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
	subjectId: number;

	@IsOptional()
	condition?: Record<string, any>;
}
