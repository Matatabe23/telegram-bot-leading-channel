import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WaterMarkRepository } from './water-mark-service.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WaterMarkRepository],
  exports: [WaterMarkRepository],
})
export class WaterMarkModule {}
