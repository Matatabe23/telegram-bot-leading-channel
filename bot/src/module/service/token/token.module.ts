import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';

@Global()
@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('SECRET_KEY_ACCESS'),
				signOptions: { expiresIn: '1d' }
			}),
			inject: [ConfigService]
		})
	],
	providers: [TokenRepository],
	exports: [TokenRepository, JwtModule]
})
export class TokenModule {}
