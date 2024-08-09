import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './file-service.repository';

@Module({
  imports: [ConfigModule],
  providers: [FileRepository],
  exports: [FileRepository],
})
export class FileModule {}
