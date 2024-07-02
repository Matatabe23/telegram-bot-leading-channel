import { dataBasePost, imageData, regularPublicationTime } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";

export async function receiving(page: number, pageSize: number) {
  if (isNaN(page) || isNaN(pageSize)) {
    throw new Error('Неверный формат параметров запроса');
  }

  const offset = (page - 1) * pageSize;

  const posts = await dataBasePost.findAll({
    include: [{
      model: imageData,
      limit: 1
    }],
    limit: pageSize,
    offset: offset
  });
  const totalCount = await dataBasePost.count();

  const updatedPosts = posts.map(post => {
    post.dataValues.imageData = post.dataValues.imageData.map(img => {
      img.image = `${S3_PATH}${S3_BUCKET_NAME}/${img.dataValues.image}`;
      return img;
    });
    return post;
  });
  const list = await regularPublicationTime.findAll()

  return { posts: updatedPosts, totalCount, publishTime: list };
}