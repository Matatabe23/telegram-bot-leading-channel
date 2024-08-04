import { regularPublicationTime, channels } from '../models/models.js';
import { Request, Response } from 'express';

import { addingPublicationTime } from '../service/settingsService/addingPublicationTime/addingPublicationTime.js'
import { deleteItemPublicationTimes } from '../service/settingsService/deleteItemPublicationTimes/deleteItemPublicationTimes.js'
import { addingNewChannels } from '../service/settingsService/addingNewChannels/addingNewChannels.js'
import { deleteChannel } from '../service/settingsService/deleteChannel/deleteChannel.js'
import { editChannel } from '../service/settingsService/editChannel/editChannel.js'

class AdministratorController {
  async addingPublicationTime(req: Request, res: Response) {
    try {
      const { hour, minute, channelId } = req.body

      const result = await addingPublicationTime(hour, minute, channelId)

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async getListRegularPublicationTimes(req: Request, res: Response) {
    try {
        const { channelId } = req.query;
        const list = await regularPublicationTime.findAll({
            where: { channelId: channelId }
        });

        res.json(list);
    } catch (error) {
        console.error('Error fetching regular publication times:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

  async addingNewChannels(req: Request, res: Response) {
    try {
      const { name, chatId } = req.body;

      const result = await addingNewChannels(name, chatId)
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async getListChannel(req: Request, res: Response) {
    const list = await channels.findAll({
      include: [
        {
          model: regularPublicationTime,
        }
      ]
    });

    res.json(list)
  }

  async deleteChannel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await deleteChannel(id)
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async editChannel(req: Request, res: Response) {
    try {
      const { id, settings } = req.body;

      const result = await editChannel(id, settings)

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }


}

export default new AdministratorController();
