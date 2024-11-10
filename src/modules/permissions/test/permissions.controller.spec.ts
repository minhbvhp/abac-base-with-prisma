import { ConflictException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { isGuarded } from '../../../shared/test/utils';
import { JwtAccessTokenGuard } from '../../auth/guards/jwt-access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsController } from '../permissions.controller';
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

jest.mock('../permissions.service');

describe('PermissionsController', () => {
	let permissionsController: PermissionsController;
	let permissionsService: PermissionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PermissionsController],
			providers: [PermissionsService],
		}).compile();

		permissionsController = module.get<PermissionsController>(
			PermissionsController,
		);
		permissionsService = module.get<PermissionsService>(PermissionsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(permissionsController).toBeDefined();
	});

	it('should be protected with RolesGuard', () => {
		expect(isGuarded(PermissionsController, RolesGuard));
	});

	it('should be protected with JwtAccessTokenGuard', () => {
		expect(isGuarded(PermissionsController, JwtAccessTokenGuard));
	});

	describe('createPermission', () => {
		it('should throw ConflictException if permission service return null', async () => {
			//arrange
			jest
				.spyOn(permissionsService, 'createPermission')
				.mockResolvedValueOnce(null);

			//act && assert
			await expect(
				permissionsController.createPermission(createPermissionDto),
			).rejects.toThrow(ConflictException);
		});

		it('should create a new permission and return response', async () => {
			//arrange

			//act
			const response =
				await permissionsController.createPermission(createPermissionDto);

			//expect
			expect(response).toEqual({
				message: 'Đã tạo quyền mới',
				result: canReadCustomerPermissionStub(),
			});
		});
	});

	describe('getAllPermissions', () => {
		it('should return response include paginated permissions', async () => {
			//arrange

			//act
			const response = await permissionsController.getAllPermissions();

			//expect
			expect(response).toEqual({
				message: 'Tìm tất cả quyền',
				result: allPermissionsStub(),
			});
		});
	});

	describe('updatePermission', () => {
		it('should throw NotFoundException if permission service return null', async () => {
			//arrange
			jest
				.spyOn(permissionsService, 'updatePermission')
				.mockResolvedValueOnce(null);

			//act && assert
			await expect(
				permissionsController.updatePermission('id', updatePermissionDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should update permission and return response', async () => {
			//arrange

			//act
			const response = await permissionsController.updatePermission(
				canReadCustomerPermissionStub().id.toString(),
				updatePermissionDto,
			);

			//act && assert
			expect(permissionsService.updatePermission).toHaveBeenCalledWith(
				canReadCustomerPermissionStub().id,
				updatePermissionDto,
			);

			expect(response).toStrictEqual({
				message: 'Đã cập nhật thông tin quyền',
				result: canCreateCustomerPermissionStub(),
			});
		});
	});

	describe('deletePermissionPermanently', () => {
		it('should throw NotFoundException if permission service return null', async () => {
			//arrange
			jest
				.spyOn(permissionsService, 'deletePermissionPermanently')
				.mockResolvedValueOnce(null);

			//act && assert
			await expect(
				permissionsController.deletePermissionPermanently('id'),
			).rejects.toThrow(NotFoundException);
		});

		it('should delete permission and return response', async () => {
			//arrange

			//act
			const response = await permissionsController.deletePermissionPermanently(
				canReadCustomerPermissionStub().id.toString(),
			);

			//act && assert
			expect(
				permissionsService.deletePermissionPermanently,
			).toHaveBeenCalledWith(canReadCustomerPermissionStub().id);

			expect(response).toStrictEqual({
				message: 'Đã xóa quyền',
				result: canReadCustomerPermissionStub(),
			});
		});
	});
});
