import { Prisma } from '@prisma/client';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	email: true,
	nameVN: true,
	nameEN: true,
	phoneNumber: true,
	createdAt: true,
	company: {
		select: {
			shortName: true,
		},
	},
	area: {
		select: {
			name: true,
		},
	},
	role: {
		select: {
			name: true,
		},
	},
});

export const userSelectWithRefreshToken = Prisma.validator<Prisma.UserSelect>()(
	{
		id: true,
		currentRefreshToken: true,
	},
);

export const userSelectWithRole = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	role: {
		select: {
			name: true,
		},
	},
});
