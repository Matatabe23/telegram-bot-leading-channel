const bcrypt = require('bcrypt');
const sequelize = require('../db');
const { administrators } = require('../models/models');
const tokenService = require('../service/token-service')
const adminDto = require('../dtos/adminDtos')

class AdministratorController {
	async registration(req:any, res:any) {
		const { email, name, password, role } = req.body;
		if (!password) {
			return res.status(400).json({ message: 'Некорректный пароль' });
		}
		const candidate = await administrators.findOne({
			where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), email.toLowerCase())
		});
		if (candidate) {
			return res.status(400).json({ message: 'Пользователь с таким name уже существует' });
		}
		const hashPassword = await bcrypt.hash(password, 5);
		const user = await administrators.create({ email, name, role, password: hashPassword });
		const resultDto = new adminDto(user)
		const token = tokenService.generateToken({ ...resultDto })
		return res.json({ token, user: resultDto });
	}

	async login(req:any, res:any) {
		const { email, password } = req.body;
		const user = await administrators.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ message: 'Пользователь не найден' });
		}
		let comparePassword = bcrypt.compareSync(password, user.password);
		if (!comparePassword) {
			return res.status(400).json({ message: 'Указанный неверный пароль' });
		}
		const resultDto = new adminDto(user)
		const token = tokenService.generateToken({ ...resultDto })
		return res.json({ token, user: resultDto });
	}

	async CheckDataWeb(req:any, res:any) {
		const id = req.user.id;
		const user = await administrators.findOne({ where: { id } });
		if (!user) return
		const resultDto = new adminDto(user)
		const token = tokenService.generateToken({ ...resultDto })
		return res.json({ token, user: resultDto });
	}

}

module.exports = new AdministratorController();