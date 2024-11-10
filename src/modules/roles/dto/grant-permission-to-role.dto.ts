import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import {
	PERMISSION_MUST_NOT_EMPTY,
	ROLE_MUST_NOT_EMPTY,
} from '../../../utils/messageConstants';

export class GrantPermissionsToRoleDto {
	@IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
	roleId: string;

	@IsArray({ message: PERMISSION_MUST_NOT_EMPTY })
	@ArrayMinSize(1, { message: PERMISSION_MUST_NOT_EMPTY })
	permissionIds: string[];
}
