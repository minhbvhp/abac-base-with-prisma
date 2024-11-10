import {
	UseGuards,
	Controller,
	Post,
	Body,
	ConflictException,
	Get,
	Query,
	Param,
	NotFoundException,
	Patch,
	Delete,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { ROLES, CustomResponseType } from '../../types/definitions';
import {
	EMAIL_ALREADY_EXISTED,
	USER_NOT_FOUND,
} from '../../utils/messageConstants';
import { PaginationDto } from '../../utils/pagination.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Roles(ROLES.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
// @ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async createUser(
		@Body() createUserDto: CreateUserDto,
	): Promise<CustomResponseType> {
		const result = await this.usersService.createUser(createUserDto);

		if (!result) {
			throw new ConflictException(EMAIL_ALREADY_EXISTED, {
				cause: new Error('Create user service return null'),
				description: 'Conflict',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã tạo người dùng mới',
			result,
		};

		return res;
	}

	@Get()
	async getAllUsers(
		@Query() paginationDto: PaginationDto,
	): Promise<CustomResponseType> {
		const { current, total } = paginationDto;
		const result = await this.usersService.getAllUsers(current, total);

		const res: CustomResponseType = {
			message: 'Tìm tất cả người dùng',
			result,
		};

		return res;
	}

	// @Get(':id')
	// async getUserById(@Param('id') id: string): Promise<CustomResponseType> {
	// 	const result = await this.usersService.getUserWithRefreshToken(id);

	// 	if (!result) {
	// 		throw new NotFoundException(USER_NOT_FOUND, {
	// 			cause: new Error('Get user service by id return null'),
	// 			description: 'Not found',
	// 		});
	// 	}

	// 	const res: CustomResponseType = {
	// 		message: 'Đã tìm thấy người dùng',
	// 		result,
	// 	};

	// 	return res;
	// }

	@Patch(':id')
	async updateUser(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<CustomResponseType> {
		const result = await this.usersService.updateUser(id, updateUserDto);

		if (!result) {
			throw new NotFoundException(USER_NOT_FOUND, {
				cause: new Error('Update user service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã cập nhật thông tin người dùng',
			result,
		};

		return res;
	}

	@Delete(':id')
	async deleteUserPermanently(
		@Param('id') id: string,
	): Promise<CustomResponseType> {
		const result = await this.usersService.deleteUserPermanently(id);

		if (!result) {
			throw new NotFoundException(USER_NOT_FOUND, {
				cause: new Error('Delete user permanently service return null'),
				description: 'Not found',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã xóa người dùng',
			result,
		};

		return res;
	}
}
