import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TGBotService } from './tg-bot-service.repository';
import { DBModule } from 'src/module/db/db.module';
import { S3Module } from '../s3-service/s3-service.module';
import { FileModule } from '../file-service/file-service.module';
import { WaterMarkModule } from '../water-mark-service/water-mark-service.module';

@Module({
	imports: [ConfigModule, DBModule, S3Module, FileModule, WaterMarkModule],
	providers: [TGBotService],
	exports: [TGBotService]
})
export class TGModule {}
