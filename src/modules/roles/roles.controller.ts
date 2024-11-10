import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { CustomResponseType, ROLES } from '../../types/definitions';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {
	ROLE_ALREADY_EXISTED,
	ROLE_NOT_FOUND,
} from '../../utils/messageConstants';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GrantPermissionsToRoleDto } from './dto/grant-permission-to-role.dto';

@Roles(ROLES.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
// @ApiTags('roles')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	async createRole(
		@Body() createRoleDto: CreateRoleDto,
	): Promise<CustomResponseType> {
		const result = await this.rolesService.createRole(createRoleDto);

		if (!result) {
			throw new ConflictException(ROLE_ALREADY_EXISTED, {
				cause: new Error('Create role service return null'),
				description: 'Conflict',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã tạo vai trò mới',
			result,
		};

		return res;
	}

	@Get()
	async getAllRoles(): Promise<CustomResponseType> {
		const result = await this.rolesService.getAllRoles();

		const res: CustomResponseType = {
			message: 'Tìm tất cả vai trò',
			result,
		};

		return res;
	}

	@Patch(':id')
	async updateRole(
		@Param('id') id: string,
		@Body() updateRoleDto: UpdateRoleDto,
	): Promise<CustomResponseType> {
		const result = await this.rolesService.updateRole(
			Number(id),
			updateRoleDto,
		);

		if (!result) {
			throw new NotFoundException(ROLE_NOT_FOUND, {
				cause: new Error('Update role service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã cập nhật thông tin vai trò',
			result,
		};

		return res;
	}

	@Delete(':id')
	async deleteRolePermanently(
		@Param('id') id: string,
	): Promise<CustomResponseType> {
		const result = await this.rolesService.deleteRolePermanently(Number(id));

		if (!result) {
			throw new NotFoundException(ROLE_NOT_FOUND, {
				cause: new Error('Delete role permanently service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã xóa vai trò',
			result,
		};

		return res;
	}

	@Post('grant-permissions')
	async grantPermissions(
		@Body() rolePermissions: GrantPermissionsToRoleDto,
	): Promise<CustomResponseType> {
		const _roleId = Number(rolePermissions.roleId);
		const _permissionIds = rolePermissions.permissionIds.map((id) =>
			Number(id),
		);
		const result = await this.rolesService.grantPermissions(
			_roleId,
			_permissionIds,
		);

		const res: CustomResponseType = {
			message: 'Đã thiết lập các quyền cho vai trò',
			result,
		};

		return res;
	}
}
