import { ChannelPosts } from '../../../models/models.js';

export async function editPostLinkСhannels(postId: number, channelIds?: number[]) {
  if (!postId || !Array.isArray(channelIds)) {
    throw new Error('Неверный формат параметров запроса');
  }

  const existingRecords = await ChannelPosts.findAll({
    where: { postId }
  });

  const existingChannelIds = existingRecords.map((record: any) => record.channelId);

  const idsToDelete = existingChannelIds.filter(id => !channelIds.includes(id));
  const idsToAdd = channelIds.filter(id => !existingChannelIds.includes(id));

  if (idsToDelete.length > 0) {
    idsToDelete.forEach(async element => {
      await ChannelPosts.destroy({
        where: {
          postId,
          channelId: element
        }
      });
    });
  }

  if (idsToAdd.length > 0) {
    idsToAdd.forEach(async element => {
      console.log(element)
      await ChannelPosts.create({
        postId,
        channelId: element,
        dataBasePostId: postId
      });
    });
  }
  console.log(idsToDelete, idsToAdd)

  return 'Успешное изменение!';
}
