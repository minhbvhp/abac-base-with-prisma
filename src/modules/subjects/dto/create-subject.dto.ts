import { IsEnum, IsNotEmpty } from 'class-validator';
import { SUBJECT_MUST_NOT_EMPTY } from '../../../utils/messageConstants';
import { SubjectName } from '@prisma/client';

export class CreateSubjectDto {
	@IsEnum(SubjectName, {
		message: () => {
			return `${SUBJECT_MUST_NOT_EMPTY}. Đối tượng chỉ bao gồm: ${Object.values(SubjectName).join(', ')}`;
		},
	})
	@IsNotEmpty({ message: SUBJECT_MUST_NOT_EMPTY })
	name: SubjectName;
}
