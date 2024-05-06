import moment from 'moment-timezone';
import schedule, { Job } from 'node-schedule';
import { IPublishTime } from '../type/types.js';

export function scheduleFunctionExecution(func: () => void, times: IPublishTime[]) {
  moment.tz.setDefault('Europe/Moscow');

  const scheduleTimes = times.map(time => {
    const moscowTime = moment().hour(time.hour).minute(time.minute).second(0).millisecond(0);
    return moscowTime.toDate();
  });

  const jobs: Job[] = [];

  scheduleTimes.forEach(time => {
    const job = schedule.scheduleJob(time, () => {
      func();
    });
    if (job) { 
      jobs.push(job);
    }
  });

  schedule.scheduleJob('0 0 * * *', () => {
    jobs.forEach(job => {
      schedule.cancelJob(job);
    });
    scheduleFunctionExecution(func, times);
  });
}
