import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ActionType, SubjectName } from '@prisma/client';

export type RequiredPermission = [ActionType, SubjectName];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

export const CheckPermissions = (
	...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
