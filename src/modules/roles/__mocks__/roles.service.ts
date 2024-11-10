import {
	salesRoleStub,
	allRolesStub,
	afterUpdatedRoleStub,
} from '../test/stubs/role.stub';

export const RolesService = jest.fn().mockReturnValue({
	createRole: jest.fn().mockResolvedValue(salesRoleStub()),
	getAllRoles: jest.fn().mockResolvedValue(allRolesStub()),
	getRoleById: jest.fn().mockResolvedValue(salesRoleStub()),
	updateRole: jest.fn().mockResolvedValue(afterUpdatedRoleStub()),
	deleteRolePermanently: jest.fn().mockResolvedValue(salesRoleStub()),
	grantPermissions: jest
		.fn()
		.mockResolvedValue({ role_id: 1, permission_ids: [1, 2, 3] }),
});
