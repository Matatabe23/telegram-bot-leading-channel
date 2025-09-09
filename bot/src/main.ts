import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.getHttpAdapter().getInstance().set('trust proxy', true);

	app.use(json({ limit: '100mb' }));
	app.use(urlencoded({ limit: '100mb', extended: true }));

	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Authorization'
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			whitelist: true,
			exceptionFactory: (errors) => {
				const formattedErrors = {};

				for (const error of errors) {
					if (error.constraints) {
						formattedErrors[error.property] = Object.values(error.constraints);
					}

					if (error.children && error.children.length) {
						formattedErrors[error.property] = error.children.map((child) => {
							return {
								[child.property]: Object.values(child.constraints || {})
							};
						});
					}
				}

				throw new BadRequestException(formattedErrors);
			}
		})
	);

	app.setGlobalPrefix('');

	const config = new DocumentBuilder()
		.setTitle('Название вашего API')
		.setDescription('Описание вашего API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.APP_PORT);
}
bootstrap();
