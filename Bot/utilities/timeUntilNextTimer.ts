export function msUntilNextTargetTime(hour: number, minute: number): number {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  let msUntilTargetTime = targetTime.getTime() - now.getTime();

  if (msUntilTargetTime < 0) {
    msUntilTargetTime += msInDay;
  }

  return msUntilTargetTime;
}