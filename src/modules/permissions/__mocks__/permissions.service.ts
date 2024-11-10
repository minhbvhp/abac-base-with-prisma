import {
	allPermissionsStub,
	canCreateCustomerPermissionStub,
	canReadCustomerPermissionStub,
} from '../test/stubs/permission.stub';

export const PermissionsService = jest.fn().mockReturnValue({
	createPermission: jest
		.fn()
		.mockResolvedValue(canReadCustomerPermissionStub()),

	getAllPermissions: jest.fn().mockResolvedValue(allPermissionsStub()),

	getPermissionById: jest
		.fn()
		.mockResolvedValue(canReadCustomerPermissionStub()),

	updatePermission: jest
		.fn()
		.mockResolvedValue(canCreateCustomerPermissionStub()),

	deletePermissionPermanently: jest
		.fn()
		.mockResolvedValue(canReadCustomerPermissionStub()),
});
