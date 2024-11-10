import { NotFoundException, ConflictException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { SubjectsService } from '../../subjects/subjects.service';
import { PermissionsService } from '../permissions.service';
import {
	createPermissionDto,
	updatePermissionDto,
} from './dto/mock-permission.dto';
import {
	canReadCustomerPermissionStub,
	allPermissionsStub,
	canCreateCustomerPermissionStub,
} from './stubs/permission.stub';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('../../subjects/subjects.service');

const mockPrisma = {
	permission: {
		findUnique: jest.fn(),
		create: jest.fn(),
		findMany: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

describe('PermissionsService', () => {
	let permissionsService: PermissionsService;
	let subjectsService: SubjectsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PermissionsService,
				SubjectsService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
			],
		}).compile();

		permissionsService = module.get<PermissionsService>(PermissionsService);
		subjectsService = module.get<SubjectsService>(SubjectsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(permissionsService).toBeDefined();
	});

	describe('createPermission', () => {
		it('should throw NotFoundException if subject not existed', async () => {
			//arrange
			jest.spyOn(subjectsService, 'getSubjectById').mockResolvedValueOnce(null);

			//act && assert
			await expect(
				permissionsService.createPermission(createPermissionDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should return null if permission existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			//act
			const result =
				await permissionsService.createPermission(createPermissionDto);

			//assert
			expect(result).toEqual(null);
		});

		it('should create permission and return it', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(null);

			jest
				.spyOn(mockPrisma.permission, 'create')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			//act
			const result =
				await permissionsService.createPermission(createPermissionDto);

			//assert
			expect(result).toEqual(canReadCustomerPermissionStub());
		});
	});

	describe('getAllPermissions', () => {
		it('should return all permissions', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findMany')
				.mockResolvedValueOnce(allPermissionsStub());

			//act
			const result = await permissionsService.getAllPermissions();

			//assert
			expect(result).toEqual(allPermissionsStub());
		});
	});

	describe('getPermissionById', () => {
		it('should return null if permission not existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(null);

			//act
			const result = await permissionsService.getPermissionById(123);

			//assert
			expect(result).toEqual(null);
		});

		it('should return existed permission', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			//act
			const result = await permissionsService.getPermissionById(
				canReadCustomerPermissionStub().id,
			);

			//assert
			expect(result).toEqual(canReadCustomerPermissionStub());
		});
	});

	describe('updatePermission', () => {
		it('should throw NotFoundException if subject not existed', async () => {
			//arrange
			jest.spyOn(subjectsService, 'getSubjectById').mockResolvedValueOnce(null);

			//act && assert
			await expect(
				permissionsService.updatePermission(1, updatePermissionDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should return null if permission not existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(null);

			//act
			const result = await permissionsService.updatePermission(
				1,
				updatePermissionDto,
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should throw error if has conflict permission', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			jest
				.spyOn(mockPrisma.permission, 'update')
				.mockRejectedValueOnce(new ConflictException());

			//act && arrange
			await expect(
				permissionsService.updatePermission(
					canReadCustomerPermissionStub().id,
					updatePermissionDto,
				),
			).rejects.toThrow(ConflictException);
		});

		it('should update permission and return it', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			jest
				.spyOn(mockPrisma.permission, 'update')
				.mockResolvedValueOnce(canCreateCustomerPermissionStub());

			//act
			const result = await permissionsService.updatePermission(
				1,
				updatePermissionDto,
			);

			//assert
			expect(result).toEqual(canCreateCustomerPermissionStub());
		});
	});

	describe('deletePermissionPermanently', () => {
		it('should return null if permission not existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(null);

			//act
			const result = await permissionsService.deletePermissionPermanently(1);

			//assert
			expect(result).toEqual(null);
		});

		it('should delete permanently permission and return it', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			//act
			const result = await permissionsService.deletePermissionPermanently(1);

			//assert
			expect(result).toEqual(canReadCustomerPermissionStub());
		});
	});
});
