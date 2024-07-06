import { dataBasePost, imageData } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";

export async function receivingPost(id: number) {
  const post = await dataBasePost.findByPk(id);
  if (!post) {
    throw new Error('Пост не найден');
  }
  const images = await imageData.findAll({ where: { dataBasePostId: id } });
  const imageList = images.map((item) => {
    return {
      id: item.dataValues.id,
      img: `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`,
      dataBasePostId: item.dataValues.dataBasePostId
    };
  });

  await post.update({ watched: true });

  return imageList
}