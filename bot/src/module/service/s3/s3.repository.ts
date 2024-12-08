import { Injectable, Logger } from '@nestjs/common';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	PutBucketPolicyCommand,
	ListObjectsV2Command,
	PutObjectAclCommand
} from '@aws-sdk/client-s3';
import { getS3ClientConfig } from 'src/config/s3.config';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class S3Repository {
	private readonly s3Client: S3Client;
	private readonly logger = new Logger(S3Repository.name);
	private readonly configService: ConfigService;

	constructor() {
		this.s3Client = new S3Client(getS3ClientConfig());
	}

	async uploadImageToS3(imagePath: any, nameFiles: string): Promise<string> {
		try {
			const webpFileName = nameFiles.replace(/\.[^/.]+$/, '.webp');
			const webpBuffer = await sharp(imagePath.buffer).webp({ quality: 80 }).toBuffer();

			const params = {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: webpFileName,
				Body: webpBuffer,
				ContentType: 'image/webp',
				ContentDisposition: 'inline'
			};

			const uploadCommand = new PutObjectCommand(params);

			await this.s3Client.send(uploadCommand);
			return webpFileName;
		} catch (err) {
			this.logger.error('Ошибка загрузки изображения:', err);
			throw err;
		}
	}

	async deleteImageFromS3(imageUrl: string): Promise<void> {
		const urlParts = imageUrl.split('/');
		const imageKey = urlParts[urlParts.length - 1];
		const idFolder = urlParts[urlParts.length - 2];

		const params = new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `${process.env.S3_FOLDER_SAVED}/${idFolder}/${imageKey}`
		});

		try {
			await this.s3Client.send(params);
		} catch (err) {
			this.logger.error('Ошибка при удалении изображения из хранилища S3:', err);
			throw err;
		}
	}

	async makeBucketPublic(): Promise<void> {
		const bucketPolicy = {
			Version: '2012-10-17',
			Statement: [
				{
					Sid: 'PublicReadGetObject',
					Effect: 'Allow',
					Principal: '*',
					Action: 's3:GetObject',
					Resource: `arn:aws:s3:::${this.configService.get('S3_BUCKET_NAME')}/*`
				}
			]
		};

		try {
			const putPolicyCommand = new PutBucketPolicyCommand({
				Bucket: this.configService.get('S3_BUCKET_NAME'),
				Policy: JSON.stringify(bucketPolicy)
			});
			await this.s3Client.send(putPolicyCommand);
			this.logger.log('Bucket policy updated to allow public access.');

			const listObjectsCommand = new ListObjectsV2Command({
				Bucket: this.configService.get('S3_BUCKET_NAME')
			});
			const objects = await this.s3Client.send(listObjectsCommand);

			if (objects.Contents) {
				for (const object of objects.Contents) {
					const putObjectAclCommand = new PutObjectAclCommand({
						Bucket: this.configService.get('S3_BUCKET_NAME'),
						Key: object.Key,
						ACL: 'public-read'
					});
					await this.s3Client.send(putObjectAclCommand);
				}
				this.logger.log('All objects in the bucket are now public.');
			}
		} catch (err) {
			this.logger.error('Error updating bucket policy or object ACLs:', err);
		}
	}

	// async deleteAllObjectsFromS3(): Promise<void> {
	//   try {
	//     const listObjectsCommand = new ListObjectsV2Command({
	//       Bucket: this.configService.get('S3_BUCKET_NAME'),
	//     });
	//     const objects = await this.s3Client.send(listObjectsCommand);

	//     if (objects.Contents) {
	//       for (const object of objects.Contents) {
	//         const deleteObjectCommand = new DeleteObjectCommand({
	//           Bucket: this.configService.get('S3_BUCKET_NAME'),
	//           Key: object.Key,
	//         });
	//         await this.s3Client.send(deleteObjectCommand);
	//       }
	//       this.logger.log('All objects in the bucket have been deleted.');
	//     }
	//   } catch (err) {
	//     this.logger.error('Error deleting objects from S3 bucket:', err);
	//   }
	// }
}
