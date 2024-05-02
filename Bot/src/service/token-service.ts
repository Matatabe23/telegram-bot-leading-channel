import jwt from 'jsonwebtoken';
import { IAdminDto } from '../type/types.js';
import { SECRET_KEY_ACCESS } from '../const/constENV.js';

class TokenService {
  generateToken(payload: IAdminDto) {
    if (SECRET_KEY_ACCESS) {
      const accessToken = jwt.sign(payload, SECRET_KEY_ACCESS, { expiresIn: '1d' });
      return accessToken;
    }
  }
}

export default new TokenService();
