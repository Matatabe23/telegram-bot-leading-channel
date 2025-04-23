import { Injectable } from '@nestjs/common';
import { S3Repository } from 'src/module/service/s3/s3.repository';

@Injectable()
export class FilesService {
	constructor(private readonly s3Repository: S3Repository) {}

	async uploadFilesToS3(files: Express.Multer.File[], nameFiles: string) {
		return {
			pagination: null,
			data: `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${await this.s3Repository.uploadFileToS3(files[0], nameFiles)}`,
			message: 'Успешное сохранение изображения в базу данных'
		};
	}
}
