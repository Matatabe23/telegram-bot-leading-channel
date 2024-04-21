const jwt = require('jsonwebtoken');
import { IAdminDto } from '../types'

class TokenService {
	generateToken(payload: IAdminDto) {
		const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: '1d' })
		return accessToken
	}
}

module.exports = new TokenService();