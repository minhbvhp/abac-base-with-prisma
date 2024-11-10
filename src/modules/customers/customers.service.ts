import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { isUUID } from 'class-validator';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
	constructor(private readonly prisma: PrismaService) {}

	async createCustomer(
		createCustomerDto: CreateCustomerDto,
		userId: string,
	): Promise<Customer> {
		try {
			if (!isUUID(userId)) {
				return null;
			}

			const existedCustomer = await this.prisma.customer.findUnique({
				where: {
					taxCode: createCustomerDto.taxCode,
				},
			});

			if (!existedCustomer) {
				const newCustomer = await this.prisma.customer.create({
					data: {
						...createCustomerDto,
						userId: userId,
					},
				});

				return newCustomer;
			}
		} catch (error) {
			throw error;
		}

		return null;
	}

	async getAllCustomers(
		current: number = 1,
		total: number = 10,
		condition: any,
	): Promise<{ customers: Customer[]; totalPages: number }> {
		try {
			const skip = (current - 1) * total;

			const [customers, totalItems] = await Promise.all([
				this.prisma.customer.findMany({
					take: total,
					skip: skip,
					where: condition,
				}),
				this.prisma.customer.count({
					where: condition,
				}),
			]);

			const totalPages = Math.ceil(totalItems / total);

			return { customers, totalPages };
		} catch (error) {
			throw error;
		}
	}

	async getCustomerById(customerId: number): Promise<Customer> {
		try {
			const customers = await this.prisma.customer.findUnique({
				where: {
					id: customerId,
				},
			});

			return customers;
		} catch (error) {
			throw new ServiceUnavailableException();
		}
	}
}
