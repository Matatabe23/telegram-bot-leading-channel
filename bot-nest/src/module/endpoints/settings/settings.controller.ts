import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('addingPublicationTime')
  async addingPublicationTime(@Body() body, @Res() res: Response) {
    try {
      const { hour, minute, channelId } = body;
      const result = await this.settingsService.addingPublicationTime(
        hour,
        minute,
        channelId,
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  @Get('getListRegularPublicationTimes')
  async getListRegularPublicationTimes(
    @Query('channelId') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const list =
        await this.settingsService.getListRegularPublicationTimes(channelId);
      res.json(list);
    } catch (error) {
      console.error('Error fetching regular publication times:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @Delete('deleteItemPublicationTimes/:id')
  async deleteItemPublicationTimes(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.settingsService.deleteItemPublicationTimes(id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  @Post('addingNewChannels')
  async addingNewChannels(@Body() body, @Res() res: Response) {
    try {
      const { name, chatId } = body;
      const result = await this.settingsService.addingNewChannels(name, chatId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  @Get('getListChannel')
  async getListChannel(@Res() res: Response) {
    try {
      const list = await this.settingsService.getListChannel();
      res.json(list);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  @Delete('deleteChannel/:id')
  async deleteChannel(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.settingsService.deleteChannel(id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  @Put('editChannel')
  async editChannel(@Body() body, @Res() res: Response) {
    try {
      const { id, settings } = body;
      const result = await this.settingsService.editChannel(id, settings);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}
