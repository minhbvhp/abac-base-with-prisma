import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from '../subjects.service';
import {
	allSubjectsStub,
	customerSubjectStub,
	updatedCustomerSubjectStub,
	userSubjectStub,
} from './stubs/subject.stub';
import { PrismaService } from '../../prisma/prisma.service';
import { SubjectName } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

const mockPrisma = {
	subject: {
		findUnique: jest.fn(),
		create: jest.fn(),
		findMany: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

describe('SubjectsService', () => {
	let subjectsService: SubjectsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubjectsService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
			],
		}).compile();

		subjectsService = module.get<SubjectsService>(SubjectsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(subjectsService).toBeDefined();
	});

	describe('createSubject', () => {
		it('should return null if subject existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			//act
			const result = await subjectsService.createSubject({
				name: SubjectName.Customer,
			});

			//assert
			expect(result).toEqual(null);
		});

		it('should create new subject and return its data', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'create')
				.mockReturnValueOnce(userSubjectStub());

			jest.spyOn(mockPrisma.subject, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await subjectsService.createSubject({
				name: SubjectName.User,
			});

			//assert
			expect(result).toEqual({ subject_name: userSubjectStub().name });
		});
	});

	describe('getAllSubjects', () => {
		it('should return all subjects', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findMany')
				.mockResolvedValueOnce(allSubjectsStub());
			//act
			const result = await subjectsService.getAllSubjects();

			//assert
			expect(result).toEqual(allSubjectsStub());
		});
	});

	describe('getSubjectById', () => {
		it('should return null if subject not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.subject, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await subjectsService.getSubjectById(
				customerSubjectStub().id,
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should return subject if subject existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			//act
			const result = await subjectsService.getSubjectById(
				customerSubjectStub().id,
			);

			//assert
			expect(result).toEqual(customerSubjectStub());
		});
	});

	describe('getSubjectByName', () => {
		it('should return null if subject not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.subject, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await subjectsService.getSubjectByName(
				customerSubjectStub().name,
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should return subject if subject existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			//act
			const result = await subjectsService.getSubjectByName(
				customerSubjectStub().name,
			);

			//assert
			expect(result).toEqual(customerSubjectStub());
		});
	});

	describe('updateSubject', () => {
		it('should return null if subject not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.subject, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await subjectsService.updateSubject(
				customerSubjectStub().id,
				{ name: SubjectName.User },
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should throw error if has conflict subject', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			jest
				.spyOn(mockPrisma.subject, 'update')
				.mockRejectedValueOnce(new ConflictException());

			//act && arrange
			await expect(
				subjectsService.updateSubject(customerSubjectStub().id, {
					name: SubjectName.User,
				}),
			).rejects.toThrow(ConflictException);
		});

		it('should return updated subject if subject existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			jest
				.spyOn(mockPrisma.subject, 'update')
				.mockResolvedValueOnce(updatedCustomerSubjectStub());

			//act
			const result = await subjectsService.updateSubject(
				customerSubjectStub().id,
				{ name: SubjectName.User },
			);

			//assert
			expect(result).toEqual(updatedCustomerSubjectStub());
		});
	});

	describe('deleteSubjectPermanently', () => {
		it('should return null if subject not existed', async () => {
			//arrange
			jest.spyOn(mockPrisma.subject, 'findUnique').mockResolvedValueOnce(null);

			//act
			const result = await subjectsService.deleteSubjectPermanently(
				customerSubjectStub().id,
			);

			//assert
			expect(result).toEqual(null);
		});

		it('should return subject if subject existed', async () => {
			//arrange
			jest
				.spyOn(mockPrisma.subject, 'findUnique')
				.mockResolvedValueOnce(customerSubjectStub());

			//act
			const result = await subjectsService.deleteSubjectPermanently(
				customerSubjectStub().id,
			);

			//assert
			expect(result).toEqual(customerSubjectStub());
		});
	});
});
