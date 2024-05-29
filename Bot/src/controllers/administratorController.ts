import { Request, Response } from 'express';
import {login} from '../service/adminService/login/login.js'
import {checkDataWeb} from '../service/adminService/checkDataWeb/checkDataWeb.js'

class AdministratorController {
  async login(req: Request, res: Response) {
    try {
      const { name, password } = req.body;
      const result = await login(name, password)
      return res.json({ ...result });
    } catch(e) {
      console.log(e)
    }
  }

  
  async checkDataWeb(req: any, res: Response) {
    const id = req.admin.id;
    const result = await checkDataWeb(id)
    return res.json({ ...result});
  }

}

export default new AdministratorController();
