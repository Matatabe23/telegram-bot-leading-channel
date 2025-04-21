import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DBModule } from './module/db/db.module';

import { PostsModule } from './module/endpoints/posts/posts.module';
import { UsersModule } from './module/endpoints/users/users.module';
import { SettingsModule } from './module/endpoints/settings/settings.module';

import { S3Module } from './module/service/s3/s3.module';
import { FileModule } from './module/service/files/files.module';
import { WaterMarkModule } from './module/service/water-mark/water-mark.module';
import { TokenModule } from './module/service/token/token.module';
import { TGBotModule } from './module/service/tg-bot/tg-bot.module';
import { RegularPublicationBotModule } from './module/service/regular-publication-bot/regular-publication-bot.module';
import { FilesModule } from './module/endpoints/files/files.module';
import { RolesModule } from './module/endpoints/roles/roles.module';
import { InitDataModule } from './module/service/init-data/init-data.module';
import { HelpersModule } from './module/service/helpers/helpers.module';
import { PaymentsModule } from './module/service/payments/payments.module';
import { WebSocketModule } from './module/websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		EventEmitterModule.forRoot(),
		DBModule,

		WebSocketModule,

		PostsModule,
		UsersModule,
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
		PaymentsModule,

		TGBotModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
