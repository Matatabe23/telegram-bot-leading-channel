import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InitDataRepository } from './init-data.repository';
import { DBModule } from 'src/module/db/db.module';
import { TGModule } from '../tg-bot/tg-bot.module';

@Global()
@Module({
	imports: [ConfigModule, DBModule, TGModule],
	providers: [InitDataRepository],
	exports: [InitDataRepository]
})
export class InitDataModule {}
