const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://s3.timeweb.cloud',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});


export function uploadImageToS3(imagePath:any) {
  const imgStream = fs.createReadStream(imagePath.path);

  const fileName = `${process.env.S3_FOLDER_SAVED}/QugorArts_${Date.now()}.png`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: imgStream,
    ContentType: 'image/png',
    ContentDisposition: 'inline'
  };

  const uploadCommand = new PutObjectCommand(params);
  s3Client.send(uploadCommand)
    .then((data: any) => {
      // console.log("Изображение успешно загружено. Ссылка на изображение:", `https://s3.timeweb.cloud/${params.Bucket}/${fileName}`);
      fs.unlink(`${imagePath.destination}${imagePath.filename}`, (err: any) => {
        if (err) {
          console.error('Ошибка при удалении файла:', err);
        } else {
          console.log('Файл успешно удален:', imagePath.path);
        }
      });
    })
    .catch((err: any) => {
      console.error("Ошибка загрузки изображения:", err);
    });
  

    return `https://s3.timeweb.cloud/${params.Bucket}/${fileName}`
}