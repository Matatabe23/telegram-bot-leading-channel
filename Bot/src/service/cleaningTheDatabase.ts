import schedule from 'node-schedule';
import { S3Client, S3ClientConfig, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_FOLDER_SAVED, S3_PATH } from "../const/constENV.js";
import { imageData } from '../models/models.js';

const s3ClientConfig: S3ClientConfig = {
  region: 'us-east-1',
  endpoint: S3_PATH,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID || '',
    secretAccessKey: S3_SECRET_ACCESS_KEY || ''
  }
};
const s3Client = new S3Client(s3ClientConfig);

export async function cleaningTheDatabase() {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
    Prefix: S3_FOLDER_SAVED
  });
  const objects = await s3Client.send(listObjectsCommand);

  objects.Contents?.forEach(async (item) => {
    if (item.Key) {
      const record = await imageData.findOne({ where: { image: item.Key } });
      if (!!record) {
        return;
      } else {
        const params = new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: item.Key
        });
        await s3Client.send(params);
      }
    }
  })


  schedule.scheduleJob('0 0 * * *', () => {
    cleaningTheDatabase();
  });
}