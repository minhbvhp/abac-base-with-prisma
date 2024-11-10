import { Subject, SubjectName } from '@prisma/client';

export const customerSubjectStub = (): Subject =>
	({
		id: 1,
		name: SubjectName.Customer,
	}) as unknown as Subject;

export const conflictSubjectStub = (): Subject =>
	({
		id: 1,
		name: SubjectName.User,
	}) as unknown as Subject;

export const updatedCustomerSubjectStub = (): Subject =>
	({
		id: 1,
		name: SubjectName.User,
	}) as unknown as Subject;

export const userSubjectStub = (): Subject =>
	({
		id: 2,
		name: SubjectName.User,
	}) as unknown as Subject;

export const allSubjectsStub = (): Subject[] => [
	customerSubjectStub(),
	userSubjectStub(),
];
