import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from 'src/module/db/db.module';
import { TGBotModule } from '../tg-bot/tg-bot.module';
import { YuKassaRepository } from './repository/yu-kassa.repository';

@Global()
@Module({
	imports: [ConfigModule, DBModule, TGBotModule],
	providers: [YuKassaRepository],
	exports: [YuKassaRepository]
})
export class PaymentsModule {}
