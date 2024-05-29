import tokenService from '../../token-service.js';
import { administrators } from '../../../models/models.js';
import adminDto from '../../../dtos/adminDtos.js';

export async function checkDataWeb(id: number) {
  const admin = await administrators.findOne({ where: { id } });
  if (!admin) return
  const resultDto = new adminDto(admin)
  const token = tokenService.generateToken({ ...resultDto })
  return { token, admin: resultDto };
}