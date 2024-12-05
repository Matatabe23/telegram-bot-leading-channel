import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TGBotService } from './tg-bot.repository';
import { DBModule } from 'src/module/db/db.module';
import { S3Module } from '../s3/s3.module';
import { FileModule } from '../files/files.module';
import { WaterMarkModule } from '../water-mark/water-mark.module';

@Module({
	imports: [ConfigModule, DBModule, S3Module, FileModule, WaterMarkModule],
	providers: [TGBotService],
	exports: [TGBotService]
})
export class TGModule {}
