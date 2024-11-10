import {
	allSubjectsStub,
	customerSubjectStub,
	updatedCustomerSubjectStub,
} from '../test/stubs/subject.stub';

export const SubjectsService = jest.fn().mockReturnValue({
	createSubject: jest
		.fn()
		.mockResolvedValue({ subject_name: customerSubjectStub().name }),
	getAllSubjects: jest.fn().mockResolvedValue(allSubjectsStub()),
	getSubjectById: jest.fn().mockResolvedValue(customerSubjectStub()),
	getSubjectByName: jest.fn().mockResolvedValue(customerSubjectStub()),
	updateSubject: jest.fn().mockResolvedValue(updatedCustomerSubjectStub()),
	deleteSubjectPermanently: jest.fn().mockResolvedValue(customerSubjectStub()),
});
