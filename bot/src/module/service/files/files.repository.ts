import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class FileRepository {
	private readonly imageFolder: string;

	constructor() {
		this.imageFolder = path.join(process.cwd(), 'src/image');
		fs.mkdirSync(this.imageFolder, { recursive: true });
	}

	async compressImage(
		buffer: Buffer,
		format: 'webp' | 'jpeg' | 'png' = 'webp',
		quality = 80
	): Promise<Buffer> {
		try {
			const transformer = sharp(buffer);

			switch (format) {
				case 'jpeg':
					return await transformer.jpeg({ quality }).toBuffer();
				case 'png':
					return await transformer.png({ quality }).toBuffer();
				case 'webp':
				default:
					return await transformer.webp({ quality }).toBuffer();
			}
		} catch (error) {
			console.error('Ошибка при сжатии изображения:', error);
			throw error;
		}
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
			return true;
		} catch (error) {
			console.error('Ошибка при удалении файла:', error);
			throw new Error('Ошибка при удалении файла: ' + error.message);
		}
	}
}
