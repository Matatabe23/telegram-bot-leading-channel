import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(payload: any) {
    if (!payload) throw new Error('Payload is undefined');
    if (this.configService.get('SECRET_KEY_ACCESS')) {
      const accessToken = this.jwtService.sign(
        { ...payload },
        {
          secret: this.configService.get('SECRET_KEY_ACCESS'),
          expiresIn: '1d',
        },
      );
      return accessToken;
    }
  }
}
