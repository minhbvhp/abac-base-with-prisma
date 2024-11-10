import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_DECORATOR } from '../../../decorators/roles.decorator';
import { RequestWithUser } from '../../../types/common.type';
import { NOT_AUTHORIZED } from '../../../utils/messageConstants';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles: string[] = this.reflector.getAllAndOverride(
			ROLES_DECORATOR,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}
		const request: RequestWithUser = context.switchToHttp().getRequest();

		const { user } = request;

		const isRoleIncluded = requiredRoles.some(
			(role) => role === user?.role?.name,
		);

		if (isRoleIncluded) return true;

		throw new ForbiddenException(NOT_AUTHORIZED);
	}
}
