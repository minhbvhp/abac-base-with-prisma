import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ActionType, Customer, User } from '@prisma/client';
import { parseCondition } from '../../utils/parseCondition';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { UserWithRole } from '../prisma/models/User/type';

type AppSubjects =
	| 'all'
	| Subjects<{
			User: User;
			Customer: Customer;
	  }>;

type PossibleAbilities = [ActionType, AppSubjects];

export type AppAbility = PureAbility<PossibleAbilities, PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
	constructor(private readonly usersService: UsersService) {}

	async createForUser(user: UserWithRole): Promise<AppAbility> {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(
			createPrismaAbility,
		);

		const permissions = await this.usersService.getPermissionsById(user.id);

		permissions.forEach((permission) => {
			const { action, subject, condition } = permission;

			if (subject) {
				if (condition) {
					const dynamicCondition = parseCondition(condition, user);

					can(action as ActionType, subject.name, dynamicCondition);
				} else {
					can(action as ActionType, subject.name);
				}
			}
		});

		return build();
	}
}
