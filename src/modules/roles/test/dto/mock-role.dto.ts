import { CreateRoleDto } from '../../dto/create-role.dto';
import { GrantPermissionsToRoleDto } from '../../dto/grant-permission-to-role.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';

export const createSalesRoleDto: CreateRoleDto = {
	name: 'Sales',
	description: 'Sales',
};

export const updateSalesRoleDto: UpdateRoleDto = {
	name: 'Sales',
	description: 'Sales',
};

export const grantPermissionsToUserDto: GrantPermissionsToRoleDto = {
	roleId: '1',
	permissionIds: ['1', '2', '3'],
};
