import { dataBasePosts, imageData, channels, ChannelPosts } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";
import { deleteImageFromS3 } from '../../s3-service.js'
import { instantPublicationPosts } from '../../../routerBot/instantPublicationPosts.js'

export async function publishInstantly(id: number) {
  const post = await dataBasePosts.findOne({
    where: {
      id: id
    },
    include: [
      { model: channels },
      { model: imageData }
    ],
  });

  if (!post) {
    throw new Error('Пост не найден');
  }

  if(post.dataValues.channels.length === 0) throw new Error('Нету каналов для публикации');
  const images = await imageData.findAll({ where: { dataBasePostId: id } });
  const imageList = images.map((item) => {
    return `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`;
  });

  const deletePost = async () => {
    
  await ChannelPosts.destroy({ where: { postId: id } });
  await imageData.destroy({ where: { dataBasePostId: id } });

  await post.destroy();

  for (const image of imageList) {
    await deleteImageFromS3(image)
  }
  }

  const path: string[] = []
  for (const image of imageList) {
    path.push(image)
  }

  for (const element of post.dataValues.channels) {
    await instantPublicationPosts(path, element.chatId, true)
  }
  await deletePost();

  return 'Пост успешно опубликован'
}