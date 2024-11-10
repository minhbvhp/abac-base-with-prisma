import { ConflictException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import {
	canReadCustomerPermissionStub,
	canCreateCustomerPermissionStub,
} from '../../permissions/test/stubs/permission.stub';
import { RolesService } from '../roles.service';
import { createSalesRoleDto, updateSalesRoleDto } from './dto/mock-role.dto';
import {
	salesRoleStub,
	allRolesStub,
	afterUpdatedRoleStub,
} from './stubs/role.stub';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrisma = {
	role: {
		findUnique: jest.fn(),
		create: jest.fn(),
		findMany: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
	permission: {
		findUnique: jest.fn(),
	},
	rolesWithPermissions: {
		createMany: jest.fn(),
	},
};

describe('RolesService', () => {
	let rolesService: RolesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
			],
		}).compile();

		rolesService = module.get<RolesService>(RolesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(rolesService).toBeDefined();
	});

	describe('createRole', () => {
		it('should return null if role existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			//act
			const result = await rolesService.createRole(createSalesRoleDto);

			//assert
			expect(result).toEqual(null);
		});

		it('should create new role and return its data', async () => {
			//arrange
			jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValueOnce(null);

			jest
				.spyOn(mockPrisma.role, 'create')
				.mockResolvedValueOnce(salesRoleStub());

			//act
			const result = await rolesService.createRole(createSalesRoleDto);

			//assert
			expect(result).toEqual(salesRoleStub());
		});
	});

	describe('getAllRoles', () => {
		it('should return all roles', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findMany')
				.mockResolvedValueOnce(allRolesStub());

			//act
			const result = await rolesService.getAllRoles();

			//assert
			expect(result).toEqual(allRolesStub());
		});
	});

	describe('getRoleById', () => {
		it('should return null if role not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await rolesService.getRoleById(123);

			//assert
			expect(result).toEqual(null);
		});

		it('should return existed role', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			//act
			const result = await rolesService.getRoleById(salesRoleStub().id);

			//assert
			expect(result).toEqual(salesRoleStub());
		});
	});

	describe('updateRole', () => {
		it('should return null if role not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await rolesService.updateRole(1, updateSalesRoleDto);

			//assert
			expect(result).toEqual(null);
		});

		it('should throw error if has conflict role', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			jest
				.spyOn(mockPrisma.role, 'update')
				.mockRejectedValueOnce(new ConflictException());

			//act && arrange
			await expect(
				rolesService.updateRole(salesRoleStub().id, updateSalesRoleDto),
			).rejects.toThrow(ConflictException);
		});

		it('should update role and return it', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			jest
				.spyOn(mockPrisma.role, 'update')
				.mockResolvedValueOnce(afterUpdatedRoleStub());

			//act
			const result = await rolesService.updateRole(2, updateSalesRoleDto);

			//assert
			expect(result).toEqual(afterUpdatedRoleStub());
		});
	});

	describe('deleteRolePermanently', () => {
		it('should return null if role not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await rolesService.deleteRolePermanently(1);

			//assert
			expect(result).toEqual(null);
		});

		it('should delete permanently role and return it', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			//act
			const result = await rolesService.deleteRolePermanently(2);

			//assert
			expect(result).toEqual(salesRoleStub());
		});
	});

	describe('grantPermission', () => {
		it('should throw NotFoundException if role not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValueOnce(null);

			//act && assert
			await expect(
				rolesService.grantPermissions(salesRoleStub().id, [
					canReadCustomerPermissionStub().id,
					canCreateCustomerPermissionStub().id,
				]),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw NotFoundException if has permission not existed', async () => {
			//arrange

			//act && assert
			await expect(
				rolesService.grantPermissions(salesRoleStub().id, [
					canReadCustomerPermissionStub().id,
					canCreateCustomerPermissionStub().id,
				]),
			).rejects.toThrow(NotFoundException);
		});

		it('should create new role_permission', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.role, 'findUnique')
				.mockResolvedValueOnce(salesRoleStub());

			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canReadCustomerPermissionStub());

			jest
				.spyOn(mockPrisma.permission, 'findUnique')
				.mockResolvedValueOnce(canCreateCustomerPermissionStub());

			//act
			const result = await rolesService.grantPermissions(salesRoleStub().id, [
				canReadCustomerPermissionStub().id,
				canCreateCustomerPermissionStub().id,
			]);

			//assert
			expect(result).toEqual({ role_id: 2, permission_ids: [1, 2] });
		});
	});
});
