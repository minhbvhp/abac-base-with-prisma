import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
	PERMISSION_CHECKER_KEY,
	RequiredPermission,
} from '../../../decorators/permissions.decorator';
import { NOT_AUTHORIZED } from '../../../utils/messageConstants';
import {
	AppAbility,
	CaslAbilityFactory,
} from '../../casl/casl-ability.factory';

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private abilityFactory: CaslAbilityFactory,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredPermissions =
			this.reflector.get<RequiredPermission[]>(
				PERMISSION_CHECKER_KEY,
				context.getHandler(),
			) || [];
		const req = context.switchToHttp().getRequest();
		const user = req.user;

		const ability = await this.abilityFactory.createForUser(user);

		const areAllAllowed = requiredPermissions.every((permission) =>
			this.isAllowed(ability, permission),
		);

		if (areAllAllowed) return true;

		throw new ForbiddenException(NOT_AUTHORIZED);
	}
	private isAllowed(
		ability: AppAbility,
		permission: RequiredPermission,
	): boolean {
		return ability.can(...permission);
	}
}
