import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InitDataRepository } from './init-data-service.repository';
import { DBModule } from 'src/module/db/db.module';
import { TGModule } from '../tg-bot-service/tg-bot-service.module';

@Global()
@Module({
	imports: [ConfigModule, DBModule, TGModule],
	providers: [InitDataRepository],
	exports: [InitDataRepository]
})
export class InitDataModule {}
