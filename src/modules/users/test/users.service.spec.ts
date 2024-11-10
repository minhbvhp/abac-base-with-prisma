import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../users.service';
import {
	afterUpdateUserStub,
	allUserStub,
	createUserStub,
} from './stubs/user.stub';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { createUserDto, updateUserDto } from './dto/mock-user.dto';
import {
	salesRoleStub,
	accountantRoleStub,
} from '../../roles/test/stubs/role.stub';
import { Company, CompanyArea, Gender } from '@prisma/client';
import { defaultUserSelect } from '../../prisma/models/User/select';

jest.mock('../../roles/roles.service');

const maleGenderStub = (): Gender => {
	return {
		id: 1,
		titleVN: 'MaleVN',
		titleEN: 'MaleEN',
	};
};

const companyStub = (): Company => {
	return {
		id: 1,
		address: 'company address',
		shortName: 'short',
		fullName: 'full',
		taxCode: '123456',
	};
};

const companyAreaStub = (): CompanyArea => {
	return {
		id: 1,
		name: 'Area 1',
	};
};

const mockPrisma = {
	user: {
		findUnique: jest.fn(),
		create: jest.fn(),
		findMany: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn(),
	},
	gender: {
		findUnique: jest.fn().mockResolvedValue(maleGenderStub()),
	},
	company: {
		findUnique: jest.fn().mockResolvedValue(companyStub()),
	},
	companyArea: {
		findUnique: jest.fn().mockResolvedValue(companyAreaStub()),
	},
};

const notAvailableId = '123abc';

const notExistId = '76131254-32ff-413b-9f94-59e6e590961f';

describe('UsersService', () => {
	let usersService: UsersService;
	let rolesService: RolesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				ConfigService,
				RolesService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		rolesService = module.get<RolesService>(RolesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('createUser', () => {
		it('should return null if user with email already exists', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.user, 'findUnique')
				.mockResolvedValueOnce(createUserStub());

			//act
			const result = await usersService.createUser(createUserDto);

			//assert
			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: {
					email: createUserDto.email,
				},
			});

			expect(result).toEqual(null);
		});

		it('should create a new user and return its data', async () => {
			// arrange
			jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValueOnce(null);

			jest
				.spyOn(mockPrisma.user, 'create')
				.mockResolvedValueOnce(createUserStub());

			jest
				.spyOn(rolesService, 'getRoleById')
				.mockResolvedValueOnce(salesRoleStub());

			const newUser = createUserStub();

			// act
			const result = await usersService.createUser(createUserDto);

			// assert
			expect(mockPrisma.user.create).toHaveBeenCalledWith({
				data: {
					...createUserDto,
					password: expect.anything(),
				},
			});

			expect(result).toEqual({ userId: newUser.id });
		});
	});

	describe('getAllUsers', () => {
		it('should return all paginated users', async () => {
			//arrange
			const current = 1;
			const total = 1;

			jest
				.spyOn(mockPrisma.user, 'findMany')
				.mockResolvedValueOnce(
					allUserStub().slice((current - 1) * total, current * total),
				);

			jest
				.spyOn(mockPrisma.user, 'count')
				.mockResolvedValueOnce(allUserStub().length);

			const skip = (current - 1) * total;
			const totalPages = Math.ceil(allUserStub().length / total);

			//act
			const result = await usersService.getAllUsers(current, total);

			//assert
			expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
				take: total,
				skip,
				select: defaultUserSelect,
			});

			expect(result).toEqual({
				users: allUserStub().slice((current - 1) * total, current * total),
				totalPages,
			});
		});
	});

	describe('getUserByEmail', () => {
		it('should return null if user not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValueOnce(null);

			const mockEmail = 'Test@gmail.com';

			//act
			const result = await usersService.getUserByEmail(mockEmail);

			//assert
			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: mockEmail },
			});

			expect(result).toEqual(null);
		});

		it('should return existed email', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.user, 'findUnique')
				.mockResolvedValueOnce(createUserStub());

			const mockEmail = createUserStub().email;

			//act
			const result = await usersService.getUserByEmail(mockEmail);

			//assert
			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: mockEmail },
			});

			expect(result).toEqual(createUserStub());
		});
	});

	describe('updateUser', () => {
		it('should return null if id is not UUID', async () => {
			//arrange

			//act
			const result = await usersService.updateUser(
				notAvailableId,
				updateUserDto,
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should return null if user does not exist', async () => {
			//arrange
			jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await usersService.updateUser(notExistId, updateUserDto);

			//assert
			expect(result).toEqual(null);
		});

		it('should update user and return formatted user response', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.user, 'findUnique')
				.mockResolvedValueOnce(createUserStub());

			jest
				.spyOn(mockPrisma.user, 'update')
				.mockResolvedValueOnce(afterUpdateUserStub());

			jest
				.spyOn(rolesService, 'getRoleById')
				.mockResolvedValueOnce(accountantRoleStub());

			const existId = createUserStub().id;
			const updatedUser = afterUpdateUserStub();

			//act
			const result = await usersService.updateUser(existId, updateUserDto);

			//assert

			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { id: existId },
				data: updateUserDto,
				select: defaultUserSelect,
			});

			expect(result).toEqual(updatedUser);
		});
	});

	describe('deleteUserPermanently', () => {
		it('should return null if id is not UUID', async () => {
			//arrange

			//act
			const result = await usersService.deleteUserPermanently(notAvailableId);

			//assert
			expect(result).toEqual(null);
		});

		it('should return null if user does not exist', async () => {
			//arrange
			jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await usersService.deleteUserPermanently(notExistId);

			//assert
			expect(result).toEqual(null);
		});

		it('Should delete user and return formatted user response', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.user, 'findUnique')
				.mockResolvedValueOnce(createUserStub());

			const existId = createUserStub().id;

			const deletedUser = createUserStub();

			//act
			const result = await usersService.deleteUserPermanently(existId);

			//assert

			expect(mockPrisma.user.delete).toHaveBeenCalledWith({
				where: { id: existId },
			});

			expect(result).toEqual(deletedUser);
		});
	});
});
