import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { ROLES_DECORATOR } from '../../../decorators/roles.decorator';
import { executionContext } from '../../../shared/test/mocks/execution-context.mock';
import { createUserStub } from '../../users/test/stubs/user.stub';
import { RolesGuard } from '../guards/roles.guard';
import { mockRequestWithUser } from './mocks/requests.mock';

describe('RolesGuard', () => {
	let rolesGuard: RolesGuard;
	let reflector: Reflector;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesGuard,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn(),
					},
				},
			],
		}).compile();

		rolesGuard = module.get<RolesGuard>(RolesGuard);
		reflector = module.get<Reflector>(Reflector);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return true if the user has a required role', () => {
		//arrange
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Admin']);

		(
			executionContext.switchToHttp().getRequest as jest.Mock
		).mockReturnValueOnce(mockRequestWithUser);

		//act && assert
		expect(rolesGuard.canActivate(executionContext)).toBeTruthy();

		expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_DECORATOR, [
			executionContext.getHandler(),
			executionContext.getClass(),
		]);
	});

	it('should return false if the user does not have a required role', () => {
		//arrange
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Admin']);

		(
			executionContext.switchToHttp().getRequest as jest.Mock
		).mockReturnValueOnce({
			user: createUserStub(),
		});

		//act && assert
		expect(() => rolesGuard.canActivate(executionContext)).toThrow(
			ForbiddenException,
		);

		expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_DECORATOR, [
			executionContext.getHandler(),
			executionContext.getClass(),
		]);
	});
});
