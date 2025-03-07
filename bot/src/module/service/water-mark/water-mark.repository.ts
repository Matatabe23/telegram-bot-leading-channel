import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Jimp from 'jimp';
import * as sharp from 'sharp';

@Injectable()
export class WaterMarkRepository {
	constructor(private readonly configService: ConfigService) {}

	async addWatermark(file: {
		fieldname: string;
		originalname: string;
		encoding: string;
		mimetype: string;
		buffer: Buffer;
		size: number;
	}) {
		try {
			let inputBuffer: Buffer;
			if (file.mimetype === 'image/webp') {
				inputBuffer = await sharp(file.buffer).png().toBuffer();
			} else {
				inputBuffer = file.buffer;
			}

			const image = await Jimp.read(inputBuffer);

			let watermark = await Jimp.read('src/assets/image/waterMark.png');
			watermark = watermark.resize(watermark.bitmap.width / 2, watermark.bitmap.height / 2);

			const x = image.bitmap.width - watermark.bitmap.width - 10;
			const y = image.bitmap.height - watermark.bitmap.height - 10;

			image.composite(watermark, x, y, {
				mode: Jimp.BLEND_SOURCE_OVER,
				opacitySource: 1,
				opacityDest: 1
			});

			const outputBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

			return {
				...file,
				buffer: outputBuffer,
				size: outputBuffer.length,
				mimetype: Jimp.MIME_PNG
			};
		} catch (err) {
			console.error('Произошла ошибка:', err);
			throw new Error('Ошибка при наложении водяного знака');
		}
	}
}
