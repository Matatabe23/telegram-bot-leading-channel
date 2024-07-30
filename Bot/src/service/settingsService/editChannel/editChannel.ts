import { channels } from '../../../models/models.js';
import { IEditChannelType } from '../../../type/types.js';

export async function editChannel(id: number, value: boolean, type: IEditChannelType) {
  if(IEditChannelType.DEFAULT_CHANNEL === type){
    await channels.update({ [type]: false }, { where: {} });
  }
  await channels.update({ [type]: value }, { where: { id } });

  return 'Успешное обновление';
}

