import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// Импортируем модели
import { Administrators } from './models/administrators.repository';
import { DataBasePosts } from './models/data-base-posts.repository';
import { ImageData } from './models/imageData.repository';
import { RegularPublicationTime } from './models/regularPublicationTime.repository';
import { Channels } from './models/channels.repository';
import { ChannelPosts } from './models/channel-posts.repository';

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				dialect: 'mysql',
				host: configService.get('dbHost'),
				port: configService.get('dbPort'),
				username: configService.get('dbUser'),
				password: configService.get('dbPassword'),
				database: configService.get('dbName'),
				models: [
					Administrators,
					DataBasePosts,
					ImageData,
					RegularPublicationTime,
					Channels,
					ChannelPosts
				],
				autoLoadModels: true,
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		SequelizeModule.forFeature([
			Administrators,
			DataBasePosts,
			ImageData,
			RegularPublicationTime,
			Channels,
			ChannelPosts
		])
	],
	exports: [SequelizeModule]
})
export class DBModule {}
