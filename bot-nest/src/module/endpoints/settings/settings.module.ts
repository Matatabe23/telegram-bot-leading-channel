import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { DBModule } from 'src/module/db/db.module';
import { RegularPublicationBotModule } from 'src/module/service/regular-publication-bot-service/regular-publication-bot-service.module';

@Module({
  imports: [DBModule, RegularPublicationBotModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
