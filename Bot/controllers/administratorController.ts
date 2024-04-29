const { administrators } = require('../models/models');
const tokenService = require('../service/token-service')
const adminDto = require('../dtos/adminDtos')
const sequelize = require('../db');
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

class AdministratorController {
  async registration(req: Request, res: Response) {
    const { name, password, confirmPassword } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Некорректный пароль' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Пароли слишком короткий, минимум 8 символов' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
    }
    const candidate = await administrators.findOne({
      where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), name.toLowerCase())
    });
    if (candidate) {
      return res.status(400).json({ message: 'Пользователь с таким name уже существует' });
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const admin = await administrators.create({ name, password: hashPassword });
    const resultDto = new adminDto(admin)
    const token = tokenService.generateToken({ ...resultDto })
    return res.json({ token, admin: resultDto });
  }

  async login(req: Request, res: Response) {
    let { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }
    name = name.toLowerCase();
    const admin = await administrators.findOne({ where: { name } });
    if (!admin) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    let comparePassword = bcrypt.compareSync(password, admin.password);
    if (!comparePassword) {
      return res.status(400).json({ message: 'Указан неверный пароль' });
    }
    const resultDto = new adminDto(admin);
    const token = tokenService.generateToken({ ...resultDto });
    return res.json({ token, admin: resultDto });
  }


  async CheckDataWeb(req: Request, res: Response) {
    const id = req.body.id;
    const admin = await administrators.findOne({ where: { id } });
    if (!admin) return
    const resultDto = new adminDto(admin)
    const token = tokenService.generateToken({ ...resultDto })
    return res.json({ token, admin: resultDto });
  }

}

module.exports = new AdministratorController();