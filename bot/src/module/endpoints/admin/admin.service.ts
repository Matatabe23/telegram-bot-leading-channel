import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Administrators } from 'src/module/db/models/administrators.repository';
import { AdminDto } from './dto/admin.dto';
import { TokenRepository } from 'src/module/service/token-service/token-service.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Administrators)
    private readonly adminRepository: typeof Administrators,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async login(name: string, password: string) {
    if (!name || !password)
      throw new UnauthorizedException('Некорректные данные');

    const lowerName = name.toLowerCase();
    const admin = await this.adminRepository.findOne({
      where: { name: lowerName },
    });
    if (!admin) throw new NotFoundException('Пользователь не найден');
    if (admin.password !== password)
      throw new UnauthorizedException('Указан неверный пароль');
    const resultDto = new AdminDto(admin.dataValues);

    const accessToken = this.tokenRepository.generateToken(resultDto, '15m');
    const refreshToken = this.tokenRepository.generateToken(
      resultDto,
      '7d',
      true,
    );

    return { accessToken, refreshToken, admin: { ...resultDto } };
  }

  async checkDataWeb(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return;
    const resultDto = new AdminDto(admin);
    const accessToken = this.tokenRepository.generateToken(
      { ...resultDto },
      '15m',
    );
    return { accessToken, admin: resultDto };
  }

  async updateAccessToken(refreshToken: string) {
    const decoded = this.tokenRepository.validateRefreshToken(refreshToken);

    const admin = await this.adminRepository.findOne({
      where: { id: decoded.id },
    });

    if (!admin) throw new NotFoundException('Пользователь не найден');
    const resultDto = new AdminDto(admin.dataValues);
    const accessToken = this.tokenRepository.generateToken(resultDto, '15m');

    const newRefreshToken = this.tokenRepository.generateToken(
      resultDto,
      '7d',
      true,
    );
    return { accessToken, refreshToken: newRefreshToken, admin: resultDto };
  }
}
