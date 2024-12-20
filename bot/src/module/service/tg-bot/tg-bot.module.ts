import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TGBotRepository } from './repository/tg-bot.repository';
import { DBModule } from 'src/module/db/db.module';
import { S3Module } from '../s3/s3.module';
import { FileModule } from '../files/files.module';
import { WaterMarkModule } from '../water-mark/water-mark.module';
import { TGBotUsersRepository } from './repository/tg-bot-users.repository';
import { TGBotService } from './tg-bot.service';
import { TGBotPostsRepository } from './repository/tg-bot-posts.repository';

@Module({
	imports: [ConfigModule, DBModule, S3Module, FileModule, WaterMarkModule],
	providers: [TGBotService, TGBotRepository, TGBotUsersRepository, TGBotPostsRepository],
	exports: [TGBotService, TGBotRepository, TGBotUsersRepository, TGBotPostsRepository]
})
export class TGBotModule {}
