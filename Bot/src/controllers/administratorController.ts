import { administrators } from '../models/models.js';
import tokenService from '../service/token-service.js';
import { Request, Response } from 'express';
import adminDto from '../dtos/adminDtos.js';


class AdministratorController {
  async login(req: Request, res: Response) {
    try {
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: 'Некорректные данные' });
      }
      const lowerName = name.toLowerCase();
      const admin = await administrators.findOne({ where: { name: lowerName } });
      if (!admin) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }
      if (admin.dataValues.password !== password) {
        return res.status(400).json({ message: 'Указан неверный пароль' });
      }
      const resultDto = new adminDto(admin);
      const token = tokenService.generateToken({ ...resultDto });
      return res.json({ token, admin: resultDto });
    } catch(e) {
      console.log(e)
    }
  }



  async checkDataWeb(req: any, res: Response) {
    const id = req.admin.id;
    const admin = await administrators.findOne({ where: { id } });
    if (!admin) return
    const resultDto = new adminDto(admin)
    const token = tokenService.generateToken({ ...resultDto })
    return res.json({ token, admin: resultDto });
  }

}

export default new AdministratorController();
