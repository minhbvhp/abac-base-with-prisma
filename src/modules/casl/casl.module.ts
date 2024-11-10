import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Global()
@Module({
	imports: [UsersModule],
	providers: [CaslAbilityFactory, PermissionsGuard],
	exports: [CaslAbilityFactory],
})
export class CaslModule {}
