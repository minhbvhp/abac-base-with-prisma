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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
	PERMISSION_ALREADY_EXISTED,
	PERMISSION_NOT_FOUND,
} from '../../utils/messageConstants';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Roles(ROLES.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
// @ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Post()
	async createPermission(
		@Body() createPermissionDto: CreatePermissionDto,
	): Promise<CustomResponseType> {
		const result =
			await this.permissionsService.createPermission(createPermissionDto);

		if (!result) {
			throw new ConflictException(PERMISSION_ALREADY_EXISTED, {
				cause: new Error('Create permission service return null'),
				description: 'Conflict',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã tạo quyền mới',
			result,
		};

		return res;
	}

	@Get()
	async getAllPermissions(): Promise<CustomResponseType> {
		const result = await this.permissionsService.getAllPermissions();

		const res: CustomResponseType = {
			message: 'Tìm tất cả quyền',
			result,
		};

		return res;
	}

	@Patch(':id')
	async updatePermission(
		@Param('id') id: string,
		@Body() updatePermissionDto: UpdatePermissionDto,
	): Promise<CustomResponseType> {
		const result = await this.permissionsService.updatePermission(
			Number(id),
			updatePermissionDto,
		);

		if (!result) {
			throw new NotFoundException(PERMISSION_NOT_FOUND, {
				cause: new Error('Update permission service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã cập nhật thông tin quyền',
			result,
		};

		return res;
	}

	@Delete(':id')
	async deletePermissionPermanently(
		@Param('id') id: string,
	): Promise<CustomResponseType> {
		const result = await this.permissionsService.deletePermissionPermanently(
			Number(id),
		);

		if (!result) {
			throw new NotFoundException(PERMISSION_NOT_FOUND, {
				cause: new Error('Delete permission permanently service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã xóa quyền',
			result,
		};

		return res;
	}
}
