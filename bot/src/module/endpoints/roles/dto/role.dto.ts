import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MUST_BE_STRING, MUST_BE_NUMBER } from 'src/const/errorConst';

export class RoleDto {
	@ApiProperty({
		description: 'Уникальный идентификатор роли',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@ApiProperty({
		description: 'Название роли',
		example: 'admin'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		description: 'Права, связанные с ролью (например, "edit_users", "delete_posts")',
		example: 'edit_roles,edit_users,edit_post,delete_posts,mark_post_viewed'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	permissions: string;

	constructor(role: any) {
		this.id = role.id;
		this.name = role.name;
		this.permissions = role.permissions;
	}
}
