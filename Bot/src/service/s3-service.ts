import { S3Client, S3ClientConfig, PutObjectCommand, DeleteObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import fs from 'fs';
import { S3_BUCKET_NAME, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_FOLDER_SAVED } from "../const/constENV.js";

const s3ClientConfig: S3ClientConfig = {
  region: 'us-east-1',
  endpoint: 'https://s3.timeweb.cloud',
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID || '',
    secretAccessKey: S3_SECRET_ACCESS_KEY || ''
  }
};
const s3Client = new S3Client(s3ClientConfig);

export function uploadImageToS3(imagePath: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const imgStream = fs.createReadStream(imagePath.path);

    const fileName = `${S3_FOLDER_SAVED}/QugorArts_${Date.now()}.png`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: imgStream,
      ContentType: 'image/png',
      ContentDisposition: 'inline'
    };

    const uploadCommand = new PutObjectCommand(params);
    s3Client.send(uploadCommand)
      .then((data: PutObjectCommandOutput) => {
        fs.unlink(`${imagePath.destination}${imagePath.filename}`, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
          }
        });
        const imageUrl = `https://s3.timeweb.cloud/${params.Bucket}/${fileName}`;
        resolve(imageUrl); // Возвращаем ссылку после успешной загрузки
      })
      .catch((err) => {
        console.error("Ошибка загрузки изображения:", err);
        reject(err); // Отклоняем обещание в случае ошибки
      });
  });
}




export async function deleteImageFromS3(imageUrl: string) {
  const urlParts = imageUrl.split("/");
  const imageKey = urlParts[urlParts.length - 1];

  const params = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: `${S3_FOLDER_SAVED}/${imageKey}`
  });

  try {
    const data = await s3Client.send(params);
    return data;
  } catch (err) {
    console.error("Ошибка при удалении изображения из хранилища S3:", err);
    throw err;
  }
}
