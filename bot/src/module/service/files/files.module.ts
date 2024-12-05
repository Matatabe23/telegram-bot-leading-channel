import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './files.repository';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [FileRepository],
	exports: [FileRepository]
})
export class FileModule {}
