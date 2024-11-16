import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express'; // Импортируем middleware для обработки тела запросов
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Устанавливаем лимит размера тела запроса до 100 MB
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  // Разрешаем все CORS-запросы
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Глобальный префикс
  app.setGlobalPrefix('api');

  // Запуск приложения
  await app.listen(process.env.APP_PORT);
}
bootstrap();
