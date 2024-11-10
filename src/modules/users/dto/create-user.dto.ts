import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsStrongPassword,
} from 'class-validator';
import {
	COMPANY__ARE_ID_MUST_NUMBER,
	COMPANY_AREA_MUST_NOT_EMPTY,
	COMPANY_ID_MUST_NUMBER,
	COMPANY_MUST_NOT_EMPTY,
	EMAIL_MUST_NOT_EMPTY,
	EMAIL_MUST_VALID,
	GENDER_ID_MUST_NUMBER,
	GENDER_MUST_NOT_EMPTY,
	NAME_EN_MUST_NOT_EMPTY,
	NAME_VN_MUST_NOT_EMPTY,
	PASSWORD_MUST_NOT_EMPTY,
	PASSWORD_NOT_STRONG,
	PHONE_MUST_NOT_EMPTY,
	ROLE_ID_MUST_NUMBER,
	ROLE_MUST_NOT_EMPTY,
} from '../../../utils/messageConstants';

export class CreateUserDto {
	@IsEmail({}, { message: EMAIL_MUST_VALID })
	@IsNotEmpty({ message: EMAIL_MUST_NOT_EMPTY })
	email: string;

	@IsStrongPassword(
		{
			minLength: 6,
			minUppercase: 1,
			minLowercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message: PASSWORD_NOT_STRONG,
		},
	)
	@IsNotEmpty({ message: PASSWORD_MUST_NOT_EMPTY })
	password: string;

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
