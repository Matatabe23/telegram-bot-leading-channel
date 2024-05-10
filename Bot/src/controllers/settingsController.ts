import { regularPublicationTime } from '../models/models.js';
import { Request, Response } from 'express';


class AdministratorController {
  async addingPublicationTime(req: Request, res: Response) {
    const { hour, minute } = req.body
    if (hour === '' || isNaN(Number(hour)) || Number(hour) < 0 || Number(hour) > 24) {
      return res.status(404).send('Не корректные данные')
    }
    if (minute === '' || isNaN(Number(minute)) || Number(minute) < 0 || Number(minute) > 59) {
      return res.status(404).send('Не корректные данные')
    }


    await regularPublicationTime.create({
      hour: hour,
      minute: minute
    });

    return res.json('Успешное добавление!');
  }

  async getListRegularPublicationTimes(req: Request, res: Response) {
    const list = await regularPublicationTime.findAll()

    res.json(list)
  }

  async deleteItemPublicationTimes(req: Request, res: Response) {
    const { id } = req.params;
    const times = await regularPublicationTime.findByPk(id);
    if (!times) {
      return res.status(404).send('Пост не найден');
    }
  
    await regularPublicationTime.destroy({ where: { id } });
  
    res.json('Успешное удаление');
  }
  

}

export default new AdministratorController();
