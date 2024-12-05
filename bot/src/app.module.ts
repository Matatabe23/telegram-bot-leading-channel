import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DBModule } from './module/db/db.module';

import { PostsModule } from './module/endpoints/posts/posts.module';
import { AdminModule } from './module/endpoints/admin/admin.module';
import { SettingsModule } from './module/endpoints/settings/settings.module';

import { S3Module } from './module/service/s3/s3.module';
import { FileModule } from './module/service/files/files.module';
import { WaterMarkModule } from './module/service/water-mark/water-mark.module';
import { TokenModule } from './module/service/token/token.module';
import { TGModule } from './module/service/tg-bot/tg-bot.module';
import { RegularPublicationBotModule } from './module/service/regular-publication-bot/regular-publication-bot.module';
import { FilesModule } from './module/endpoints/files/files.module';
import { RolesModule } from './module/endpoints/roles/roles.module';
import { InitDataModule } from './module/service/init-data/init-data.module';
import { HelpersModule } from './module/service/helpers/helpers.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		DBModule,

		PostsModule,
		AdminModule,
		SettingsModule,
		FilesModule,
		RolesModule,

		S3Module,
		FileModule,
		WaterMarkModule,
		TokenModule,
		RegularPublicationBotModule,
		InitDataModule,
		HelpersModule,

		TGModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
