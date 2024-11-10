import { IsNotEmpty, IsNumber } from 'class-validator';
import {
	NAME_VN_MUST_NOT_EMPTY,
	NAME_EN_MUST_NOT_EMPTY,
	GENDER_ID_MUST_NUMBER,
	GENDER_MUST_NOT_EMPTY,
	PHONE_MUST_NOT_EMPTY,
	ROLE_ID_MUST_NUMBER,
	ROLE_MUST_NOT_EMPTY,
	COMPANY_ID_MUST_NUMBER,
	COMPANY_MUST_NOT_EMPTY,
	COMPANY__ARE_ID_MUST_NUMBER,
	COMPANY_AREA_MUST_NOT_EMPTY,
} from '../../../utils/messageConstants';

export class UpdateUserDto {
	@IsNotEmpty({ message: NAME_VN_MUST_NOT_EMPTY })
	nameVN: string;

	@IsNotEmpty({ message: NAME_EN_MUST_NOT_EMPTY })
	nameEN: string;

	@IsNumber({}, { message: GENDER_ID_MUST_NUMBER })
	@IsNotEmpty({ message: GENDER_MUST_NOT_EMPTY })
	genderId: number;

	@IsNotEmpty({ message: PHONE_MUST_NOT_EMPTY })
	phoneNumber: string;

	@IsNumber({}, { message: ROLE_ID_MUST_NUMBER })
	@IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
	roleId: number;

	@IsNumber({}, { message: COMPANY_ID_MUST_NUMBER })
	@IsNotEmpty({ message: COMPANY_MUST_NOT_EMPTY })
	companyId: number;

	@IsNumber({}, { message: COMPANY__ARE_ID_MUST_NUMBER })
	@IsNotEmpty({ message: COMPANY_AREA_MUST_NOT_EMPTY })
	companyAreaId: number;
}
