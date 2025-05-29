import { Injectable } from '@nestjs/common';
import { S3Repository } from 'src/module/service/s3/s3.repository';
import * as path from 'path';

@Injectable()
export class FilesService {
	constructor(private readonly s3Repository: S3Repository) {}

	async uploadFilesToS3(files: Express.Multer.File[], nameFiles: string) {
		if (!files || files.length === 0) {
			return {
				pagination: null,
				data: [],
				message: 'Нет загруженных файлов'
			};
		}

		const isSingleFile = files.length === 1;

		const uploadedPaths = await Promise.all(
			files.map((file, index) => {
				const extension = path.extname(file.originalname);
				const baseName = isSingleFile
					? `${nameFiles}${extension}`
					: `${nameFiles}_${index + 1}${extension}`;
				return this.s3Repository.uploadFileToS3(file, baseName);
			})
		);

		return {
			pagination: null,
			data: uploadedPaths.map(
				(path) => `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${path}`
			),
			message: `Успешное сохранение ${isSingleFile ? 'файла' : 'файлов'} в базу данных`
		};
	}

	async deleteFilesFromS3(urls: string[]): Promise<{ deleted: string[] }> {
		const deleted: string[] = [];

		for (const url of urls) {
			try {
				await this.s3Repository.deleteImageFromS3(url);
				deleted.push(url);
			} catch (err) {
				//
			}
		}

		return { deleted };
	}
}
