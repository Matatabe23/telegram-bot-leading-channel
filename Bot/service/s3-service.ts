const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
// });

export function uploadImageToS3(imagePath:string, keyName:string) {
  const fileContent = fs.readFileSync(imagePath);

  const params = {
    Bucket: '2ecf572e-2b873220-cc07-49c8-8678-708468e33070',
    Key: keyName,
    Body: fileContent,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err:any, data:any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}