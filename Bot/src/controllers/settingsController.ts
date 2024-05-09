import { regularPublicationTime } from '../models/models.js';
import { Request, Response } from 'express';


class AdministratorController {
  async addingPublicationTime(req: Request, res: Response) {
    const { hour, minute } = req.body
    if (hour === '' || isNaN(Number(hour)) || Number(hour) < 0 || Number(hour) > 24) {
      return res.status(404).send('Не корректные данные')
    }
    if (minute === '' || isNaN(Number(minute)) || Number(minute) < 0 || Number(minute) > 24) {
      return res.status(404).send('Не корректные данные')
    }


    await regularPublicationTime.create({
      hour: hour,
      minute: minute
    });

    return res.json('Успешное добавление!');
  }

}

export default new AdministratorController();
