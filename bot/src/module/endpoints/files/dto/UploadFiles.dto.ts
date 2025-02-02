import { IsNotEmpty, IsString } from 'class-validator';
import { MUST_BE_STRING } from 'src/const/errorConst';

export class UploadFilesDto {
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	fileName: string;
}
