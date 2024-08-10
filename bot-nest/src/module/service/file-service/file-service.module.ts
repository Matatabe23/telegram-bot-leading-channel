import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './file-service.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FileRepository],
  exports: [FileRepository],
})
export class FileModule {}
