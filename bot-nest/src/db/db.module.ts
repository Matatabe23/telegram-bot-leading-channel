import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// Импортируем модели
import { Administrators } from './models/administrators.model';
import { DataBasePosts } from './models/dataBasePosts.model';
import { ImageData } from './models/imageData.model';
import { RegularPublicationTime } from './models/regularPublicationTime.model';
import { Channels } from './models/channels.model';
import { ChannelPosts } from './models/channelPosts.model';

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
          ChannelPosts,
        ],
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DBModule {}
