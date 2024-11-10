import { ConflictException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { isGuarded } from '../../../shared/test/utils';
import { JwtAccessTokenGuard } from '../../auth/guards/jwt-access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import {
	createSalesRoleDto,
	updateSalesRoleDto,
	grantPermissionsToUserDto,
} from './dto/mock-role.dto';
import {
	salesRoleStub,
	allRolesStub,
	afterUpdatedRoleStub,
} from './stubs/role.stub';

jest.mock('../roles.service');

describe('RolesController', () => {
	let rolesController: RolesController;
	let rolesService: RolesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RolesController],
			providers: [RolesService],
		}).compile();

		rolesController = module.get<RolesController>(RolesController);
		rolesService = module.get<RolesService>(RolesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(rolesController).toBeDefined();
	});

	it('should be protected with RolesGuard', () => {
		expect(isGuarded(RolesController, RolesGuard));
	});

	it('should be protected with JwtAccessTokenGuard', () => {
		expect(isGuarded(RolesController, JwtAccessTokenGuard));
	});

	describe('createRole', () => {
		it('should throw ConflictException if role service return null', async () => {
			//arrange
			jest.spyOn(rolesService, 'createRole').mockResolvedValueOnce(null);

			//act && assert
			await expect(
				rolesController.createRole(createSalesRoleDto),
			).rejects.toThrow(ConflictException);
		});

		it('should create a new role and return response', async () => {
			//arrange

			//act
			const response = await rolesController.createRole(createSalesRoleDto);

			//expect
			expect(response).toEqual({
				message: 'Đã tạo vai trò mới',
				result: salesRoleStub(),
			});
		});
	});

	describe('getAllRoles', () => {
		it('should return response include paginated roles', async () => {
			//arrange

			//act
			const response = await rolesController.getAllRoles();

			//expect
			expect(response).toEqual({
				message: 'Tìm tất cả vai trò',
				result: allRolesStub(),
			});
		});
	});

	describe('updateRole', () => {
		it('should throw NotFoundException if role service return null', async () => {
			//arrange
			jest.spyOn(rolesService, 'updateRole').mockResolvedValueOnce(null);

			//act && assert
			await expect(
				rolesController.updateRole('id', updateSalesRoleDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should update role and return response', async () => {
			//arrange

			//act
			const response = await rolesController.updateRole(
				salesRoleStub().id.toString(),
				updateSalesRoleDto,
			);

			//act && assert
			expect(rolesService.updateRole).toHaveBeenCalledWith(
				salesRoleStub().id,
				updateSalesRoleDto,
			);

			expect(response).toStrictEqual({
				message: 'Đã cập nhật thông tin vai trò',
				result: afterUpdatedRoleStub(),
			});
		});
	});

	describe('deleteRolePermanently', () => {
		it('should throw NotFoundException if role service return null', async () => {
			//arrange
			jest
				.spyOn(rolesService, 'deleteRolePermanently')
				.mockResolvedValueOnce(null);

			//act && assert
			await expect(rolesController.deleteRolePermanently('id')).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should delete role and return response', async () => {
			//arrange

			//act
			const response = await rolesController.deleteRolePermanently(
				salesRoleStub().id.toString(),
			);

			//act && assert
			expect(rolesService.deleteRolePermanently).toHaveBeenCalledWith(
				salesRoleStub().id,
			);

			expect(response).toStrictEqual({
				message: 'Đã xóa vai trò',
				result: salesRoleStub(),
			});
		});
	});

	describe('grantPermissions', () => {
		it('should grant permissions to role and return response', async () => {
			//arrange
			const _roleId = Number(grantPermissionsToUserDto.roleId);
			const _permissions_ids = grantPermissionsToUserDto.permissionIds.map(
				(id) => Number(id),
			);

			//act
			const response = await rolesController.grantPermissions(
				grantPermissionsToUserDto,
			);

			//act && assert
			expect(rolesService.grantPermissions).toHaveBeenCalledWith(
				_roleId,
				_permissions_ids,
			);

			expect(response).toStrictEqual({
				message: 'Đã thiết lập các quyền cho vai trò',
				result: {
					role_id: _roleId,
					permission_ids: _permissions_ids,
				},
			});
		});
	});
});
