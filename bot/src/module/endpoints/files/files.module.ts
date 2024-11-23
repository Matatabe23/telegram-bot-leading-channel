import { Module } from '@nestjs/common';
import { TokenModule } from 'src/module/service/token-service/token-service.module';
import { DBModule } from 'src/module/db/db.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
	imports: [DBModule, TokenModule],
	controllers: [FilesController],
	providers: [FilesService, AuthGuard]
})
export class FilesModule {}
