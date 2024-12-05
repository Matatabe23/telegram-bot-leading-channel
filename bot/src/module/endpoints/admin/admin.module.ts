import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TokenModule } from 'src/module/service/token/token.module';
import { DBModule } from 'src/module/db/db.module';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
	imports: [DBModule, TokenModule],
	controllers: [AdminController],
	providers: [AdminService, AuthGuard]
})
export class AdminModule {}
