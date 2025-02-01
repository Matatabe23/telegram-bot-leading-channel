import { Module } from '@nestjs/common';
import { DBModule } from 'src/module/db/db.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './advertisement.service';

@Module({
	imports: [DBModule],
	controllers: [AdvertisementController],
	providers: [AdvertisementService, AuthGuard]
})
export class AdvertisementModule {}
