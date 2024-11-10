import { SetMetadata } from '@nestjs/common';

export const ROLES_DECORATOR = 'roles';
export const Roles = (...roles: string[]) =>
	SetMetadata(ROLES_DECORATOR, roles);
