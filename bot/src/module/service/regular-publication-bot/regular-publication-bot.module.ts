import { Module, Global, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegularPublicationBotRepository } from './regular-publication-bot.repository';
import { DBModule } from 'src/module/db/db.module';
import { TGBotModule } from '../tg-bot/tg-bot.module';

@Global()
@Module({
	imports: [ConfigModule, DBModule, forwardRef(() => TGBotModule)],
	providers: [RegularPublicationBotRepository],
	exports: [RegularPublicationBotRepository]
})
export class RegularPublicationBotModule {}
