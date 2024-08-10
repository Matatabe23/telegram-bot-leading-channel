import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  controllers: [],
  imports: [ConfigModule, PostsModule, AdminModule, SettingsModule],
  providers: [],
})
export class ModulesModule {}
