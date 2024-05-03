import jwt from 'jsonwebtoken';
import { NOT_AUTHORIZED, ERROR } from '../const/const.js';
import { SECRET_KEY_ACCESS } from '../const/constENV.js';

export default function (req: any, res: any, next: any) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: NOT_AUTHORIZED });
    }
    if (SECRET_KEY_ACCESS) {
      const decoded = jwt.verify(token, SECRET_KEY_ACCESS);
      req.admin = decoded;
      next();
    }
  } catch (e) {
    res.status(401).json({ message: ERROR });
  }
}
