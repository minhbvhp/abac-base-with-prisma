import {
	Body,
	ConflictException,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { CustomersService } from './customers.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { RequestWithUser } from '../../types/common.type';
import {
	CUSTOMER_ALREADY_EXISTED,
	CUSTOMER_NOT_FOUND,
	NOT_AUTHORIZED,
} from '../../utils/messageConstants';
import { CustomResponseType } from '../../types/definitions';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../../decorators/permissions.decorator';
import { PaginationDto } from '../../utils/pagination.dto';
import { ActionType, SubjectName } from '@prisma/client';
import { subject } from '@casl/ability';

@UseGuards(JwtAccessTokenGuard)
// @ApiTags('customers')
@Controller('customers')
export class CustomersController {
	constructor(
		private readonly customersService: CustomersService,
		private abilityFactory: CaslAbilityFactory,
	) {}

	@Post()
	async createCustomer(
		@Body() createCustomerDto: CreateCustomerDto,
		@Req() request: RequestWithUser,
	) {
		const { user } = request;
		const result = await this.customersService.createCustomer(
			createCustomerDto,
			user.id,
		);

		if (!result) {
			throw new ConflictException(CUSTOMER_ALREADY_EXISTED, {
				cause: new Error('Create customer service return null'),
				description: 'Conflict',
			});
		}

		const res: CustomResponseType = {
			message: 'Đã tạo khách hàng mới',
			result,
		};

		return res;
	}

	@UseGuards(PermissionsGuard)
	@CheckPermissions([ActionType.read, SubjectName.Customer])
	@Get()
	async getAllCustomers(
		@Query() paginationDto: PaginationDto,
		@Req() request: RequestWithUser,
	): Promise<CustomResponseType> {
		const { user } = request;

		const ability = await this.abilityFactory.createForUser(user);

		const condition = ability.rules.find(
			(r) => r.action === ActionType.read && r.subject === SubjectName.Customer,
		).conditions;

		const { current, total } = paginationDto;
		const customers = await this.customersService.getAllCustomers(
			current,
			total,
			condition,
		);

		const res: CustomResponseType = {
			message: 'Tìm tất cả khách hàng',
			result: customers,
		};

		return res;
	}

	@UseGuards(PermissionsGuard)
	@CheckPermissions([ActionType.read, SubjectName.Customer])
	@Get(':id')
	async getCustomerById(
		@Param('id') id: string,
		@Req() request: RequestWithUser,
	): Promise<CustomResponseType> {
		const { user } = request;

		const ability = await this.abilityFactory.createForUser(user);

		const customer = await this.customersService.getCustomerById(Number(id));

		if (!customer) {
			throw new NotFoundException(CUSTOMER_NOT_FOUND);
		}

		if (!ability.can(ActionType.read, subject('Customer', customer))) {
			throw new ForbiddenException(NOT_AUTHORIZED);
		}

		const res: CustomResponseType = {
			message: 'Đã tìm thấy khách hàng',
			result: customer,
		};

		return res;
	}
}
