import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Repository } from './s3-service.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [S3Repository],
  exports: [S3Repository],
})
export class S3Module {}
