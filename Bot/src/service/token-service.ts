import jwt from 'jsonwebtoken';
import { IAdminDto } from '../type/types.js';

class TokenService {
  generateToken(payload: IAdminDto) {
    if (process.env.SECRET_KEY_ACCESS) {
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: '1d' });
      return accessToken;
    }
  }
}

export default new TokenService();
