import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload-files-to-s3')
	@UseGuards(AuthGuard)
	@UseInterceptors(FilesInterceptor('files[]'))
	async uploadFilesToS3(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: { fileName: string }
	) {
		try {
			return this.filesService.uploadFilesToS3(files, body.fileName);
		} catch (e) {
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					message: e.message
				},
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
