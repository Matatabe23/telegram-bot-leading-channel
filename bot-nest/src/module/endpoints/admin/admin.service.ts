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
    const token = this.tokenRepository.generateToken(resultDto);
    return { token, admin: { ...resultDto } };
  }

  async checkDataWeb(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return;
    const resultDto = new AdminDto(admin);
    const token = this.tokenRepository.generateToken({ ...resultDto });
    return { token, admin: resultDto };
  }
}
