import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegularPublicationBotRepository } from './regular-publication-bot-service.repository';
import { DBModule } from 'src/module/db/db.module';
import { TGModule } from '../tg-bot-service/tg-bot-service.module';

@Global()
@Module({
  imports: [ConfigModule, DBModule, TGModule],
  providers: [RegularPublicationBotRepository],
  exports: [RegularPublicationBotRepository],
})
export class RegularPublicationBotModule {}
