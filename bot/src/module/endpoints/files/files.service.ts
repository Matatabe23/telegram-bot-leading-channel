import { Injectable } from '@nestjs/common';
import { S3Repository } from 'src/module/service/s3-service/s3-service.repository';

@Injectable()
export class FilesService {
	constructor(private readonly s3Repository: S3Repository) {}

	async uploadFilesToS3(files: Express.Multer.File[], nameFiles: string) {
		return `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${await this.s3Repository.uploadImageToS3(files[0], nameFiles)}`;
	}
}
