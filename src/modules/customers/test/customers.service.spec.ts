import { TestingModule, Test } from '@nestjs/testing';
import { CustomersService } from '../customers.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrisma = {
	customer: {
		findUnique: jest.fn(),
		create: jest.fn(),
		findMany: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn(),
	},
};

describe('CustomersService', () => {
	let customersService: CustomersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CustomersService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
			],
		}).compile();

		customersService = module.get<CustomersService>(CustomersService);
	});

	it('should be defined', () => {
		expect(customersService).toBeDefined();
	});
});
