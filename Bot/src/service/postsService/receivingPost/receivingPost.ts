import { dataBasePosts, imageData, channels } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";

export async function receivingPost(id: number) {
  const post = await dataBasePosts.findByPk(id, {
    include: [
      { model: channels },
      { model: imageData },
    ]
  });

  const channelsList = await channels.findAll();

  if (!post) throw new Error('Пост не найден');

  const imageList = post.dataValues.imageData.map((item) => {
    return {
      id: item.dataValues.id,
      img: `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`,
      dataBasePostId: item.dataValues.dataBasePostId
    };
  });

  await post.update({ watched: true });

  return { imageList, channelsPost: post.dataValues.channels, channelsList };
}
