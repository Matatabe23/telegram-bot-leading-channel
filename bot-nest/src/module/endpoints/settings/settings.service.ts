import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegularPublicationBotRepository } from 'src/module/service/regular-publication-bot-service/regular-publication-bot-service.repository';

import { RegularPublicationTime } from 'src/module/db/models/regularPublicationTime.repository';
import { Channels } from 'src/module/db/models/channels.repository';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(RegularPublicationTime)
    private readonly regularPublicationTime: typeof RegularPublicationTime,
    @InjectModel(Channels)
    private readonly channels: typeof Channels,
    private readonly regularPublicationBotRepository: RegularPublicationBotRepository,
  ) {}

  async addingPublicationTime(hour, minute, channelId) {
    if (
      hour === '' ||
      isNaN(Number(hour)) ||
      Number(hour) < 0 ||
      Number(hour) > 24
    ) {
      throw new Error('Некорректные данные');
    }
    if (
      minute === '' ||
      isNaN(Number(minute)) ||
      Number(minute) < 0 ||
      Number(minute) > 59
    ) {
      throw new Error('Некорректные данные');
    }
    if (!channelId) {
      throw new Error('Некорректный айди чата');
    }

    await this.regularPublicationTime.create({
      hour: hour,
      minute: minute,
      channelId: channelId,
    });

    this.regularPublicationBotRepository.scheduleFunctionExecution();

    return 'Успешное добавление!';
  }

  async getListRegularPublicationTimes(channelId) {
    const list = await this.regularPublicationTime.findAll({
      where: { channelId: channelId },
    });
    return list;
  }

  async deleteItemPublicationTimes(id) {
    const times = await this.regularPublicationTime.findByPk(id);
    if (!times) {
      throw new Error('Некорректные данные');
    }

    await this.regularPublicationTime.destroy({ where: { id } });
    this.regularPublicationBotRepository.scheduleFunctionExecution();

    return 'Успешное удаление';
  }

  async addingNewChannels(name, chatId) {
    if (!name || !chatId) throw new Error('Некорректные данные');

    console.log(name, chatId);

    await this.channels.create({
      name: name,
      chatId: chatId,
      settings: '',
    });

    return 'Успешное добавление!';
  }

  async getListChannel() {
    const list = await this.channels.findAll({
      include: [
        {
          model: RegularPublicationTime,
        },
      ],
    });
    return list;
  }

  async deleteChannel(id) {
    const times = await this.channels.findByPk(id);
    if (!times) {
      throw new Error('Некорректные данные');
    }

    await this.channels.destroy({ where: { id } });

    return 'Успешное удаление';
  }

  async editChannel(id, settings) {
    const settingsString = settings.join(',');

    await this.channels.update({ settings: settingsString }, { where: { id } });

    return 'Успешное обновление';
  }
}
