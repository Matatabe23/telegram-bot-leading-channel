import { dataBasePost, imageData } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";
import { deleteImageFromS3 } from '../../s3-service.js'
import { instantPublicationPosts } from '../../../routerBot/instantPublicationPosts.js'

export async function publishInstantly(id: number) {
  const post = await dataBasePost.findByPk(id);
  if (!post) {
    throw new Error('Пост не найден');
  }
  const images = await imageData.findAll({ where: { dataBasePostId: id } });
  const imageList = images.map((item) => {
    return `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`;
  });

  const path: string[] = []
  for (const image of imageList) {
    path.push(image)
  }

  const result = await instantPublicationPosts(path, true)

  await imageData.destroy({ where: { dataBasePostId: id } });

  await post.destroy();

  if (result) {
    for (const image of imageList) {
      await deleteImageFromS3(image)
    }
  }

  return 'Пост успешно опубликован'
}