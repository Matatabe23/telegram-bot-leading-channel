import { regularPublicationTime } from '../models/models.js';
import { Request, Response } from 'express';

import { addingPublicationTime } from '../service/settingsService/addingPublicationTime/addingPublicationTime.js'
import { deleteItemPublicationTimes } from '../service/settingsService/deleteItemPublicationTimes/deleteItemPublicationTimes.js'

class AdministratorController {
  async addingPublicationTime(req: Request, res: Response) {
    try {
      const { hour, minute } = req.body

      const result = await addingPublicationTime(hour, minute)

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async getListRegularPublicationTimes(req: Request, res: Response) {
    const list = await regularPublicationTime.findAll()

    res.json(list)
  }

  async deleteItemPublicationTimes(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await deleteItemPublicationTimes(id)
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }


}

export default new AdministratorController();
