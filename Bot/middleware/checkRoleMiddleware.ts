const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
import { EMiddlewareErrors } from '../types'


//Компонент не доделан!!!

module.exports = (Action) => {
	return async (req: any, res: any, next: any) => {
		if (req.method === "OPTIONS") {
			next();
		}
		try {
			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				return res.status(401).json({ message: EMiddlewareErrors.NOT_AUTHORIZED });
			}
			const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
			const id = decoded.id;
			const candidate = await User.findOne({ where: { id } });

			if (!candidate) {
				return res.status(401).json({ message: EMiddlewareErrors.USER_NOT_FOUND });
			}

			const userRole = candidate.role;

			let validRoles = Roles;

			validRoles = Roles.filter(role => role[Action]);
			

			const hasAccess = validRoles.some(role => role.NameRole === userRole);

			if (!hasAccess) {
				return res.status(403).json({ message: EMiddlewareErrors.NO_ACCESS });
			}

			req.user = decoded;
			next();
		} catch (e) {
			res.status(401).json({ message: EMiddlewareErrors.NOT_AUTHORIZED });
		}
	};
};