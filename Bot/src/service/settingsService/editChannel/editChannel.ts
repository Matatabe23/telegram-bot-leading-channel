import { channels } from '../../../models/models.js';
import { IEditChannelType } from '../../../type/types.js';

export async function editChannel(id: number, settings: IEditChannelType[]) {
  const settingsString = settings.join(',');

  await channels.update({ settings: settingsString }, { where: { id } });

  return 'Успешное обновление';
}

