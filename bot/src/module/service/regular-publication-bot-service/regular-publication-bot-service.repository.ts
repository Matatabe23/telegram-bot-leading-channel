import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment-timezone';
import * as schedule from 'node-schedule';
import { RegularPublicationTime } from 'src/module/db/models/regularPublicationTime.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { TGBotService } from '../tg-bot-service/tg-bot-service.repository';

@Injectable()
export class RegularPublicationBotRepository implements OnModuleInit {
  private jobs: any[] = [];

  constructor(
    @InjectModel(RegularPublicationTime)
    private readonly regularPublicationTime: typeof RegularPublicationTime,
    private readonly tGBotService: TGBotService,
  ) {}

  async onModuleInit() {
    await this.scheduleFunctionExecution();

    schedule.scheduleJob('0 0 * * *', async () => {
      await this.scheduleFunctionExecution();
    });
  }

  async scheduleFunctionExecution() {
    moment.tz.setDefault('Europe/Moscow');

    const times = await this.getPublishTimesFromDB();
    const scheduleTimes = times.map((time) => {
      const moscowTime = moment()
        .hour(time.hour)
        .minute(time.minute)
        .second(0)
        .millisecond(0);
      return { time: moscowTime.toDate(), chatId: time.chatId };
    });

    this.jobs.forEach((job) => schedule.cancelJob(job));
    this.jobs = [];

    scheduleTimes.forEach((time) => {
      const job = schedule.scheduleJob(time.time, () => {
        this.tGBotService.sendMessageAtScheduledTime(time);
      });
      if (job) {
        this.jobs.push(job);
      }
    });
  }

  private async getPublishTimesFromDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const allRegularPublicationTimes =
            await this.regularPublicationTime.findAll({
              include: [{ model: Channels }],
            });
          resolve(
            allRegularPublicationTimes.map((time: any) => ({
              hour: time.hour,
              minute: time.minute,
              ...time.channel.dataValues,
            })),
          );
        } catch (error) {
          reject(error);
        }
      }, 5000);
    });
  }
}
