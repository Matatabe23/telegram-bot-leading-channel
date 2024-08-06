import moment from 'moment-timezone';
import schedule, { Job } from 'node-schedule';
import { regularPublicationTime, channels } from '../models/models.js';
import sendMessageAtScheduledTime from '../routerBot/sendMessageAtScheduledTime.js'

let jobs: Job[] = [];

export async function scheduleFunctionExecution() {
  moment.tz.setDefault('Europe/Moscow');

  const times = await getPublishTimesFromDB();
  const scheduleTimes = times.map(time => {
    const moscowTime = moment().hour(time.hour).minute(time.minute).second(0).millisecond(0);
    return {time: moscowTime.toDate(), chatId: time.chatId};
  });

  jobs.forEach(job => schedule.cancelJob(job));
  jobs = [];

  scheduleTimes.forEach(time => {
    const job = schedule.scheduleJob(time.time, () => {
      sendMessageAtScheduledTime(time);
    });
    if (job) { 
      jobs.push(job);
    }
  });
}

async function getPublishTimesFromDB(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const allRegularPublicationTimes = await regularPublicationTime.findAll({
          include: [
            { model: channels },
          ]
        });
        resolve(allRegularPublicationTimes.map((time: any) => ({
          hour: time.hour,
          minute: time.minute,
          ...time.channel.dataValues
        })));
      } catch (error) {
        reject(error);
      }
    }, 5000);
  });
}


schedule.scheduleJob('0 0 * * *', async () => {
  await scheduleFunctionExecution();
});