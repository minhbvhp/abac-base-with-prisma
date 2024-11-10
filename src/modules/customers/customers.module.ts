import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CaslModule } from '../casl/casl.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [CaslModule, PrismaModule],
	controllers: [CustomersController],
	providers: [CustomersService],
	exports: [CustomersService],
})
export class CustomersModule {}
