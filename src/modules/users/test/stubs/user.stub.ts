import { User } from '@prisma/client';
import {
	UserWithRefreshToken,
	UserWithRole,
} from '../../../prisma/models/User/type';

export const createUserStub = (): User => {
	return {
		id: '9c8ffd82-c1df-46f7-b090-0585997485db',
		email: 'Test1@gmail.com',
		password: 'strongP@ssword',
		nameVN: 'Tiếng Việt',
		nameEN: 'English',
		genderId: 1,
		phoneNumber: '0123456789',
		companyId: 2,
		companyAreaId: 1,
		createdAt: new Date('2024-09-30T08:16:58.302Z'),
		roleId: 2,
		currentRefreshToken: null,
	};
};

export const adminUserStub = (): User => {
	return {
		id: '9c8ffd82-c1df-46f7-b090-0585997485db',
		email: 'Test1@gmail.com',
		password: 'strongP@ssword',
		nameVN: 'Tiếng Việt',
		nameEN: 'English',
		genderId: 1,
		phoneNumber: '0123456789',
		companyId: 2,
		companyAreaId: 1,
		createdAt: new Date('2024-09-30T08:16:58.302Z'),
		roleId: 1,
		currentRefreshToken: null,
	};
};

export const adminWithRoleStub = (): UserWithRole => {
	return {
		id: '9c8ffd82-c1df-46f7-b090-0585997485db',
		role: {
			name: 'Admin',
		},
	};
};

export const adminWithRefreshTokenStub = (): UserWithRefreshToken => {
	return {
		id: '9c8ffd82-c1df-46f7-b090-0585997485db',
		currentRefreshToken: 'refresh_token',
	};
};

export const afterUpdateUserStub = (): User => {
	return {
		id: '9c8ffd82-c1df-46f7-b090-0585997485db',
		email: 'Test1@gmail.com',
		password: 'strongP@ssword',
		nameVN: 'Tiếng Việt Updated',
		nameEN: 'English Updated',
		genderId: 2,
		phoneNumber: '55555',
		companyId: 1,
		companyAreaId: 1,
		createdAt: new Date('2024-09-30T08:16:58.302Z'),
		roleId: 3,
		currentRefreshToken: null,
	};
};

export const allUserStub = (): User[] => [createUserStub(), adminUserStub()];
