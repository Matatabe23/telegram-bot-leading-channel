import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { WaterMarkModule } from 'src/module/service/water-mark/water-mark.module';
import { S3Module } from 'src/module/service/s3/s3.module';
import { DBModule } from 'src/module/db/db.module';
import { TGModule } from 'src/module/service/tg-bot/tg-bot.module';
import { FileModule } from 'src/module/service/files/files.module';
import { HelpersModule } from 'src/module/service/helpers/helpers.module';

@Module({
	imports: [DBModule, WaterMarkModule, S3Module, TGModule, FileModule, HelpersModule],
	controllers: [PostsController],
	providers: [PostsService, AuthGuard]
})
export class PostsModule {}
