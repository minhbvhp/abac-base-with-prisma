import { Request } from 'express';
import { UserWithRole } from '../modules/prisma/models/User/type';

export interface RequestWithUser extends Request {
	user: UserWithRole;
}

export type Tokens = {
	access_token: string;
	refresh_token: string;
};
