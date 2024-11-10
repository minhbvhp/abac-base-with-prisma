import { RequestWithUser } from '../../../../types/common.type';
import { adminWithRoleStub } from '../../../users/test/stubs/user.stub';

export const mockRequestWithUser = {
	user: adminWithRoleStub(),
} as RequestWithUser;
