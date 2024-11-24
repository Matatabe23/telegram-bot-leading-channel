import { Module } from '@nestjs/common';
import { DBModule } from 'src/module/db/db.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
	imports: [DBModule],
	controllers: [RolesController],
	providers: [RolesService, AuthGuard]
})
export class RolesModule {}
