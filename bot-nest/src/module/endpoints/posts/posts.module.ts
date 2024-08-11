import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { WaterMarkModule } from 'src/module/service/water-mark-service/water-mark-service.module';
import { S3Module } from 'src/module/service/s3-service/s3-service.module';
import { DBModule } from 'src/module/db/db.module';
import { TGModule } from 'src/module/service/tg-bot-service/tg-bot-service.module';

@Module({
  imports: [DBModule, WaterMarkModule, S3Module, TGModule],
  controllers: [PostsController],
  providers: [PostsService, AuthGuard],
})
export class PostsModule {}
