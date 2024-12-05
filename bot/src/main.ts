import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Устанавливаем лимит размера тела запроса до 100 MB
	app.use(json({ limit: '100mb' }));
	app.use(urlencoded({ limit: '100mb', extended: true }));

	// Разрешаем все CORS-запросы
	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Authorization'
	});

	// Глобальный префикс
	app.setGlobalPrefix('');

	// Конфигурация Swagger
	const config = new DocumentBuilder()
		.setTitle('Название вашего API') // Название API
		.setDescription('Описание вашего API') // Описание
		.setVersion('1.0') // Версия API
		.addBearerAuth() // Добавляем поддержку авторизации
		.build();

	// Создаем Swagger-документ
	const document = SwaggerModule.createDocument(app, config);

	// Настраиваем роут для Swagger UI
	SwaggerModule.setup('docs', app, document);

	// Запуск приложения
	await app.listen(process.env.APP_PORT);
}
bootstrap();
