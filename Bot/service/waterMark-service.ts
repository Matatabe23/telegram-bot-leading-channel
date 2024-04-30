const Jimp = require('jimp');

export async function addWatermark(inputImagePath: any) {
  try {
      const image = await Jimp.read(inputImagePath);
      let watermark = await Jimp.read('../image/waterMark.png');

      watermark = watermark.resize(watermark.bitmap.width / 1.5, watermark.bitmap.height / 1.5);

      const x = (image.bitmap.width - watermark.bitmap.width) / 2;
      const y = image.bitmap.height - watermark.bitmap.height - 10;

      image.composite(watermark, x, y, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1
      });

      return image
  } catch (err) {
      console.error('An error occurred:', err);
  }
}