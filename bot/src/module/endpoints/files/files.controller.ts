import {
	Body,
	Controller,
	Delete,
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
import { UploadFilesDto } from './dto/UploadFiles.dto';
import { ApiTags } from '@nestjs/swagger';
import { UploadFilesToS3Swagger } from './decorators/upload-files-to-s3.decorator';
import { DeleteFilesFromS3Swagger } from './decorators/delete-files-from-s3.decorator';

@Controller('files')
@ApiTags('Файлы')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload-files-to-s3')
	@UseGuards(AuthGuard)
	@UseInterceptors(FilesInterceptor('files[]'))
	@UploadFilesToS3Swagger()
	async uploadFilesToS3(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: UploadFilesDto
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

	@Delete('delete-files-from-s3')
	// @UseGuards(AuthGuard)
	@DeleteFilesFromS3Swagger()
	async deleteFilesFromS3(@Body('urls') urls: string[]) {
		try {
			return await this.filesService.deleteFilesFromS3(urls);
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
