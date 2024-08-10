import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DBModule } from './module/db/db.module';
import { PostsModule } from './module/endpoints/posts/posts.module';
import { AdminModule } from './module/endpoints/admin/admin.module';
import { SettingsModule } from './module/endpoints/settings/settings.module';

import { S3Module } from './module/service/s3-service/s3-service.module';
import { FileModule } from './module/service/file-service/file-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DBModule,

    PostsModule,
    AdminModule,
    SettingsModule,

    S3Module,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
