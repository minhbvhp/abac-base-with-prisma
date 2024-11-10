import { ActionType, Permission } from '@prisma/client';
import { customerSubjectStub } from '../../../subjects/test/stubs/subject.stub';

export const canReadCustomerPermissionStub = (): Permission =>
	({
		id: 1,
		action: ActionType.read,
		subject: customerSubjectStub(),
		condition: { userId: '${id}' },
	}) as unknown as Permission;

export const conflictPermissionStub = (): Permission =>
	({
		id: 1,
		action: ActionType.create,
		subject: customerSubjectStub(),
		condition: { zone: '${id}' },
	}) as unknown as Permission;

export const canCreateCustomerPermissionStub = (): Permission =>
	({
		id: 2,
		action: ActionType.create,
		subject: customerSubjectStub(),
		condition: { userId: '${id}' },
	}) as unknown as Permission;

export const allPermissionsStub = (): Permission[] => [
	canReadCustomerPermissionStub(),
	canCreateCustomerPermissionStub(),
];
