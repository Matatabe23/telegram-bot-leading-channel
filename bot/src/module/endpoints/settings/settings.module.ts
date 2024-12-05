import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { DBModule } from 'src/module/db/db.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegularPublicationBotModule } from 'src/module/service/regular-publication-bot/regular-publication-bot.module';

@Module({
	imports: [DBModule, RegularPublicationBotModule],
	controllers: [SettingsController],
	providers: [SettingsService, AuthGuard]
})
export class SettingsModule {}
