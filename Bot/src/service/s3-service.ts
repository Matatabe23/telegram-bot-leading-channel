import { S3Client, S3ClientConfig, PutObjectCommand, DeleteObjectCommand, PutBucketPolicyCommand, ListObjectsV2Command, PutObjectAclCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import { S3_BUCKET_NAME, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_FOLDER_SAVED, S3_PATH } from "../const/constENV.js";

const s3ClientConfig: S3ClientConfig = {
  region: 'us-east-1',
  endpoint: S3_PATH,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID || '',
    secretAccessKey: S3_SECRET_ACCESS_KEY || ''
  }
};
const s3Client = new S3Client(s3ClientConfig);

export function uploadImageToS3(imagePath: any, postId: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const imgStream = fs.createReadStream(imagePath.path);

    const fileName = `${S3_FOLDER_SAVED}/${Date.now()}_${postId}.png`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: imgStream,
      ContentType: 'image/png',
      ContentDisposition: 'inline',
    };

    const uploadCommand = new PutObjectCommand(params);
    s3Client.send(uploadCommand)
      .then(() => {
        fs.unlink(`${imagePath.destination}${imagePath.filename}`, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
          }
        });
        resolve(fileName);
      })
      .catch((err) => {
        console.error("Ошибка загрузки изображения:", err);
        reject(err);
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

// Превращение бакета в публичный
async function makeBucketPublic() {
  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${S3_BUCKET_NAME}/*`
      }
    ]
  };

  try {
    // Установить политику бакета
    const putPolicyCommand = new PutBucketPolicyCommand({
      Bucket: S3_BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    });
    await s3Client.send(putPolicyCommand);
    console.log("Bucket policy updated to allow public access.");

    // Получить список всех объектов в бакете
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME
    });
    const objects = await s3Client.send(listObjectsCommand);

    // Установить ACL для каждого объекта
    if (objects.Contents) {
      for (const object of objects.Contents) {
        const putObjectAclCommand = new PutObjectAclCommand({
          Bucket: S3_BUCKET_NAME,
          Key: object.Key,
          ACL: 'public-read'
        });
        await s3Client.send(putObjectAclCommand);
      }
      console.log("All objects in the bucket are now public.");
    }
  } catch (err) {
    console.error("Error updating bucket policy or object ACLs:", err);
  }
}

async function deleteAllObjectsFromS3() {
  try {
    // Получить список всех объектов в бакете
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME
    });
    const objects = await s3Client.send(listObjectsCommand);

    // Удалить каждый объект
    console.log(objects.Contents)
    if (objects.Contents) {
      for (const object of objects.Contents) {
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: object.Key
        });
        await s3Client.send(deleteObjectCommand);
      }
      console.log("All objects in the bucket have been deleted.");
    }
  } catch (err) {
    console.error("Error deleting objects from S3 bucket:", err);
  }
}

// deleteAllObjectsFromS3()