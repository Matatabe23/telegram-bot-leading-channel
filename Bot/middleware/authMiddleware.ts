const jwt = require('jsonwebtoken');
import { EMiddlewareErrors } from '../types'

module.exports = function (req: any, res: any, next: any) {
	if (req.method === "OPTIONS") {
		next()
	}
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: EMiddlewareErrors.NOT_AUTHORIZED }) 
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
		req.user = decoded;
		next();
	} catch (e) {
		res.status(401).json({ message: EMiddlewareErrors.ERROR })
	}
};
 