import { TestingModule, Test } from '@nestjs/testing';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { CustomersController } from '../customers.controller';
import { CustomersService } from '../customers.service';

jest.mock('../customers.service');
jest.mock('../../casl/casl-ability.factory');

describe('CustomersController', () => {
	let customersController: CustomersController;
	let customersService: CustomersService;
	let abilityFactory: CaslAbilityFactory;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomersController],
			providers: [CustomersService, CaslAbilityFactory],
		}).compile();

		customersController = module.get<CustomersController>(CustomersController);
		customersService = module.get<CustomersService>(CustomersService);
		abilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
	});

	it('should be defined', () => {
		expect(customersController).toBeDefined();
	});
});
