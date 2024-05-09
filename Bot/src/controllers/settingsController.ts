// import { regularPublicationTime } from '../models/models.js';
import { Request, Response } from 'express';


class AdministratorController {
  async addingPublicationTime(req: Request, res: Response) {
    // const { hour, minute } = req.body
    // if (hour && minute) return res.status(404).send('Не корректные данные');
    // const newRegularPublicationTime = await regularPublicationTime.create({
    //   hour: hour,
    //   minute: minute
    // });

    // return res.json(newRegularPublicationTime);
  }

}

export default new AdministratorController();
