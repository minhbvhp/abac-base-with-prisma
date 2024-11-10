import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

export const createUserDto = {
	email: 'Test1@gmail.com',
	password: 'Test1@gmail.com',
	nameVN: 'Tiếng Việt',
	nameEN: 'English',
	genderId: 1,
	phoneNumber: '0123456789',
	roleId: 2,
	companyId: 2,
	companyAreaId: 1,
} as CreateUserDto;

export const updateUserDto = {
	nameVN: 'Tiếng Việt Updated',
	nameEN: 'English Updated',
	genderId: 2,
	phoneNumber: '55555',
	roleId: 3,
	companyId: 1,
	companyAreaId: 1,
} as UpdateUserDto;
