import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class FileRepository {
	private readonly imageFolder: string;

	constructor() {
		this.imageFolder = path.join(process.cwd(), 'src/image');
		fs.mkdirSync(this.imageFolder, { recursive: true });
	}

	async downloadFile(url: string): Promise<{
		fieldname: string;
		originalname: string;
		encoding: string;
		mimetype: string;
		buffer: Buffer;
		size: number;
	}> {
		try {
			const response = await axios({
				url,
				method: 'GET',
				responseType: 'arraybuffer'
			});

			const buffer = Buffer.from(response.data);
			const originalname = path.basename(url);
			const mimetype = response.headers['content-type'] || 'application/octet-stream';

			return {
				fieldname: 'files[]',
				originalname,
				encoding: '7bit',
				mimetype,
				buffer,
				size: buffer.length
			};
		} catch (error) {
			throw new Error('Ошибка при скачивании файла: ' + error.message);
		}
	}

	async deleteLocalFile(file: string): Promise<boolean> {
		try {
			const filePath = path.join(this.imageFolder, file);
			await fs.promises.unlink(filePath);
			console.log('Файл успешно удален:', file);
			return true;
		} catch (error) {
			console.error('Ошибка при удалении файла:', error);
			throw new Error('Ошибка при удалении файла: ' + error.message);
		}
	}
}
