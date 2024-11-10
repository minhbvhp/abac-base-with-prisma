import { IsNotEmpty } from 'class-validator';
import {
	ADDRESS_MUST_NOT_EMPTY,
	FULLNAME_MUST_NOT_EMPTY,
	SHORTNAME_MUST_NOT_EMPTY,
	TAXCODE_MUST_NOT_EMPTY,
} from '../../../utils/messageConstants';

export class CreateCustomerDto {
	@IsNotEmpty({ message: TAXCODE_MUST_NOT_EMPTY })
	taxCode: string;

	@IsNotEmpty({ message: SHORTNAME_MUST_NOT_EMPTY })
	shortName: string;

	@IsNotEmpty({ message: FULLNAME_MUST_NOT_EMPTY })
	fullName: string;

	@IsNotEmpty({ message: ADDRESS_MUST_NOT_EMPTY })
	address: string;
}
