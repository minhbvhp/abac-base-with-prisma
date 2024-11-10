import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { SubjectsModule } from '../subjects/subjects.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [SubjectsModule, PrismaModule, SubjectsModule],
	controllers: [PermissionsController],
	providers: [PermissionsService],
})
export class PermissionsModule {}
