import moment from 'moment-timezone';
import schedule from 'node-schedule';
import { IPublishTime } from '../type/types.js';

export function scheduleFunctionExecution(func: () => void, times: IPublishTime[]) {
  moment.tz.setDefault('Europe/Moscow');

  const scheduleTimes = times.map(time => {
    const moscowTime = moment().hour(time.hour).minute(time.minute).second(0).millisecond(0);
    return moscowTime.toDate();
  });

  scheduleTimes.forEach(time => {
    schedule.scheduleJob(time, () => {
      func();
    });
  });
}
