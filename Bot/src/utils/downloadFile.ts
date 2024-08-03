import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imageFolder = path.join(__dirname, '../image');

fs.mkdir(imageFolder, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка при создании папки:', err);
  }
});

export async function downloadFile(url: string): Promise<string> {
  try {
    const localFilePath = path.join(imageFolder, path.basename(url));
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    const writer = fs.createWriteStream(localFilePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(localFilePath));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error('Ошибка при скачивании файла: ' + error);
  }
}

export async function deleteLocalFile(file: string): Promise<boolean> {
  try {
    const filePath = path.join(imageFolder, file);
    console.log(filePath)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Ошибка при удалении файла:', err);
      } else {
        console.log('Файл успешно удален:', file);
      }
    });
    return true
  } catch (error) {
    throw new Error('Ошибка при скачивании файла: ' + error);
  }
}


