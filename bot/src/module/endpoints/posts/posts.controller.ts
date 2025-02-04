import {
	Controller,
	Post,
	Body,
	UseGuards,
	UseInterceptors,
	UploadedFiles,
	HttpException,
	HttpStatus,
	Put,
	Get,
	Query,
	Delete,
	Param,
	Req
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { IImageBlock } from 'src/types/types';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { HelpersRepository } from 'src/module/service/helpers/helpers.repository';
import { ApiTags } from '@nestjs/swagger';
import { ApiUnifiedPublication } from './decorators/api-unified-publication.decorator';
import { ApiReceiving } from './decorators/api-receiving.decorator';
import { ApiDeletePost } from './decorators/api-delete-post.decorator';
import { ApiPublishInstantly } from './decorators/api-publish-instantly.decorator';
import { ApiReceivingPost } from './decorators/api-receiving-post.decorator';
import { ApiChangePage } from './decorators/api-change-page.decorator';
import { ApiUpdatePost } from './decorators/api-update-post.decorator';

@Controller('posts')
@ApiTags('Посты')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly helpersRepository: HelpersRepository
	) {}

	@Post('unified-publication')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.PUBLISH_POSTS))
	@UseInterceptors(FilesInterceptor('files[]'))
	@ApiUnifiedPublication()
	async unifiedPublication(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: { waterMark: string; chatIdList: string; isInstant: string }
	) {
		try {
			const waterMark = JSON.parse(body.waterMark);
			const chatIdList = body.chatIdList !== '' ? body.chatIdList.split(',') : [];
			const isInstant = body.isInstant === 'true' ? true : false;

			const result = await this.postsService.unifiedPublication(
				files,
				waterMark,
				chatIdList,
				isInstant
			);

			return result;
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

	@Put('update-posts')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_POSTS))
	@ApiUpdatePost()
	async updatePosts(@Body() body: { id: number; channelIds: number[]; idList: IImageBlock[] }) {
		try {
			return await this.postsService.updatePosts(body);
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

	@Get('receiving')
	@UseGuards(AuthGuard)
	@ApiReceiving()
	async receiving(
		@Query('page') page: number,
		@Query('perpage') perpage: number,
		@Query('watched') watched: string,
		@Query('channel') channel: string,
		@Query('search') search: string
	) {
		try {
			const result = this.postsService.receiving(page, perpage, watched, channel, search);

			return result;
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

	@Delete('delete-post/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.DELETE_POSTS))
	@ApiDeletePost()
	async deletePost(@Param('id') id: number) {
		try {
			const result = await this.postsService.deletePost(id);
			return result;
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

	@Post('publish-instantly/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.PUBLISH_POSTS))
	@ApiPublishInstantly()
	async publishInstantly(@Param('id') id: number) {
		try {
			const result = await this.postsService.publishInstantly(id);
			return result;
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

	@Get('receiving-post/:id')
	@UseGuards(AuthGuard)
	@ApiReceivingPost()
	async receivingPost(@Req() request: any, @Param('id') id: number) {
		try {
			const isPermissions = await this.helpersRepository.checkPermissions(
				request.authData.role,
				EPermissions.MARK_POST_VIEWED
			);
			const result = await this.postsService.receivingPost(id, isPermissions);
			return result;
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

	@Get('change-page/:id')
	@UseGuards(AuthGuard)
	@ApiChangePage()
	async changePage(
		@Param('id') id: number,
		@Query('where') where?: string,
		@Query('watched') watched?: string,
		@Query('channel') channel?: string
	) {
		try {
			const result = await this.postsService.changePage(id, where, watched, channel);
			return result;
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
