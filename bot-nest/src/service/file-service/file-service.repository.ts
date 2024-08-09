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

  async downloadFile(url: string): Promise<string> {
    try {
      const localFilePath = path.join(this.imageFolder, path.basename(url));
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });
      const writer = fs.createWriteStream(localFilePath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(localFilePath));
        writer.on('error', reject);
      });
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
