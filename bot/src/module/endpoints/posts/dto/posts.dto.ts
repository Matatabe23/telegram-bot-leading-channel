import { ChannelsDto } from './../../settings/dto/channels.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ImageDataDto } from './image-data.dto'; // ДТО для ImageData, если необходимо

export class PostsDto {
	@ApiProperty({
		description: 'Уникальный идентификатор поста',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ApiProperty({
		description: 'Флаг, указывающий на просмотр поста',
		example: false
	})
	@IsNotEmpty()
	@IsBoolean()
	watched: boolean;

	@ApiProperty({
		description: 'Флаг, указывающий на наличие водяного знака',
		example: false
	})
	@IsNotEmpty()
	@IsBoolean()
	waterMark: boolean;

	@ApiProperty({
		description: 'Список изображений, связанных с постом',
		type: [ImageDataDto],
		example: [{ id: 1, url: 'image.jpg' }]
	})
	@IsArray()
	images: ImageDataDto[];

	@ApiProperty({
		description: 'Список каналов, связанных с постом',
		type: [ChannelsDto],
		example: [{ id: 1, name: 'Channel 1' }]
	})
	@IsArray()
	channels: ChannelsDto[];
}
