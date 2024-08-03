import fs from 'fs';
import axios from 'axios';

export async function downloadFile(url: string, filePath: string): Promise<boolean> {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error('Ошибка при скачивании файла: ' + error);
  }
}
