import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject, SubjectName } from '@prisma/client';
import { UNIQUE_VIOLATION_CODE } from '../../types/definitions';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SUBJECT_ALREADY_EXISTED } from '../../utils/messageConstants';

@Injectable()
export class SubjectsService {
	constructor(private readonly prisma: PrismaService) {}

	async createSubject(createSubjectDto: CreateSubjectDto) {
		try {
			const existedSubject = await this.prisma.subject.findUnique({
				where: {
					name: createSubjectDto.name,
				},
			});

			if (!existedSubject) {
				const newSubject = await this.prisma.subject.create({
					data: {
						...createSubjectDto,
					},
				});

				return { subject_name: newSubject.name };
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async getAllSubjects(): Promise<Subject[]> {
		try {
			const SubjectName = await this.prisma.subject.findMany();

			return SubjectName;
		} catch (error) {
			throw error;
		}
	}

	async getSubjectById(id: number): Promise<Subject> {
		const existedSubject = await this.prisma.subject.findUnique({
			where: {
				id: id,
			},
		});

		return existedSubject;
	}

	async getSubjectByName(subjectName: SubjectName): Promise<Subject> {
		const existedSubject = await this.prisma.subject.findUnique({
			where: {
				name: subjectName,
			},
		});

		return existedSubject;
	}

	async updateSubject(
		id: number,
		updateSubjectDto: UpdateSubjectDto,
	): Promise<Subject> {
		try {
			const existedSubject = await this.prisma.subject.findUnique({
				where: {
					id: id,
				},
			});

			if (existedSubject) {
				const updatedSubject = await this.prisma.subject.update({
					where: {
						id: id,
					},
					data: {
						...updateSubjectDto,
					},
				});

				return updatedSubject;
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === UNIQUE_VIOLATION_CODE) {
					throw new ConflictException(SUBJECT_ALREADY_EXISTED);
				}
			}

			throw error;
		}

		return null;
	}

	async deleteSubjectPermanently(id: number): Promise<Subject> {
		try {
			const existedSubject = await this.prisma.subject.findUnique({
				where: {
					id: id,
				},
			});

			if (existedSubject) {
				await this.prisma.subject.delete({
					where: {
						id: id,
					},
				});

				return existedSubject;
			}
		} catch (error) {
			throw error;
		}

		return null;
	}
}
