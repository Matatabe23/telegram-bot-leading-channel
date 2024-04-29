const jwt = require('jsonwebtoken');
const { administrators } = require('../models/models');
import { NOT_AUTHORIZED, NO_ACCESS, USER_NOT_FOUND, roles } from '../const/const'


//Компонент не доделан!!!

module.exports = (Action: string) => {
  return async (req: any, res: any, next: any) => {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: NOT_AUTHORIZED });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
      const id = decoded.id;
      const candidate = await administrators.findOne({ where: { id } });

      if (!candidate) {
        return res.status(401).json({ message: USER_NOT_FOUND });
      }

      const userRole = candidate.role;

      let validRoles = roles;

      validRoles = roles.filter(role => role[Action]);


      const hasAccess = validRoles.some(role => role.NameRole === userRole);

      if (!hasAccess) {
        return res.status(403).json({ message: NO_ACCESS });
      }

      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: NOT_AUTHORIZED });
    }
  };
};