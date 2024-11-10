import { Prisma } from '@prisma/client';
import {
	defaultUserSelect,
	userSelectWithRefreshToken,
	userSelectWithRole,
} from './select';

export type DefaultUserData = Prisma.UserGetPayload<{
	select: typeof defaultUserSelect;
}>;

export type UserWithRefreshToken = Prisma.UserGetPayload<{
	select: typeof userSelectWithRefreshToken;
}>;

export type UserWithRole = Prisma.UserGetPayload<{
	select: typeof userSelectWithRole;
}>;
