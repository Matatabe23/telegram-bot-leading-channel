import tokenService from '../../token-service.js';
import { administrators } from '../../../models/models.js';
import adminDto from '../../../dtos/adminDtos.js';

export async function login(name: string, password: string) {
  if (!name || !password) {
    throw new Error('Некорректные данные');
  }
  const lowerName = name.toLowerCase();
  const admin = await administrators.findOne({ where: { name: lowerName } });
  if (!admin) {
    throw new Error('Пользователь не найден');
  }
  if (admin.dataValues.password !== password) {
    throw new Error('Указан неверный пароль');
  }
  const resultDto = new adminDto(admin);
  const token = tokenService.generateToken({ ...resultDto });
  return { token, admin: resultDto };
}