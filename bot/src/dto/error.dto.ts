import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
	@ApiProperty({ example: 500, description: 'HTTP статус ошибки' })
	status: number;

	@ApiProperty({ example: 'Internal Server Error', description: 'Сообщение об ошибке' })
	message: string;
}
