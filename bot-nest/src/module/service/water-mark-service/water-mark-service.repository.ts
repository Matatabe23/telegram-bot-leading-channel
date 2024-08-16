import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Jimp from 'jimp';

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
      // Чтение изображения из буфера
      const image = await Jimp.read(file.buffer);
      let watermark = await Jimp.read('src/assets/image/waterMark.png');
      watermark = watermark.resize(
        watermark.bitmap.width / 1.5,
        watermark.bitmap.height / 1.5,
      );

      // Расположение водяного знака
      const x = (image.bitmap.width - watermark.bitmap.width) / 2;
      const y = image.bitmap.height - watermark.bitmap.height - 10;

      // Наложение водяного знака на изображение
      image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1,
      });

      // Конвертация изображения обратно в буфер
      const outputBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

      // Возврат результата
      return {
        ...file,
        buffer: outputBuffer,
        size: outputBuffer.length,
      };
    } catch (err) {
      console.error('Произошла ошибка:', err);
      throw new Error('Ошибка при наложении водяного знака');
    }
  }
}
