import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelpersRepository } from './helpers.repository';
import { DBModule } from 'src/module/db/db.module';

@Global()
@Module({
	imports: [ConfigModule, DBModule],
	providers: [HelpersRepository],
	exports: [HelpersRepository]
})
export class HelpersModule {}
