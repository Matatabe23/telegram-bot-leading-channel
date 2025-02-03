import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ImageDataDto {
	@ApiProperty({
		description: 'Уникальный идентификатор изображения',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ApiProperty({
		description: 'Ссылка на изображение',
		example: 'https://example.com/image.jpg'
	})
	@IsNotEmpty()
	@IsString()
	image: string;

	@ApiProperty({
		description: 'Идентификатор поста, к которому привязано изображение',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber()
	dataBasePostId: number;

	constructor(imageData: any) {
		this.id = imageData.id;
		this.image = imageData.image;
		this.dataBasePostId = imageData.dataBasePostId;
	}
}
