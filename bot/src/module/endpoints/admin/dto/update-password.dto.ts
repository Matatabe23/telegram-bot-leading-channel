import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MUST_BE_STRING } from 'src/const/errorConst';

export class UpdatePasswordDto {
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	oldPassword: string;

	@IsString()
	@MinLength(6, { message: 'Минимально 6 символов' })
	newPassword: string;
}
