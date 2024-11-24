import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// Импортируем модели
import { Administrators } from './models/administrators.repository';
import { DataBasePosts } from './models/data-base-posts.repository';
import { ImageData } from './models/image-data.repository';
import { RegularPublicationTime } from './models/regular-publication-time.repository';
import { Channels } from './models/channels.repository';
import { ChannelPosts } from './models/channel-posts.repository';
import { RolesSettings } from './models/roles-settings.repository';

const dbList = [
	Administrators,
	DataBasePosts,
	ImageData,
	RegularPublicationTime,
	Channels,
	ChannelPosts,
	RolesSettings
];

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
				models: dbList,
				autoLoadModels: true,
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		SequelizeModule.forFeature(dbList)
	],
	exports: [SequelizeModule]
})
export class DBModule {}