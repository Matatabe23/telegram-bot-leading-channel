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
import { IImageBlock } from 'src/type/types';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/const/const';
import { HelpersRepository } from 'src/module/service/helpers/helpers.repository';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly helpersRepository: HelpersRepository
	) {}

	@Post('publication')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.PUBLISH_POSTS))
	@UseInterceptors(FilesInterceptor('files[]'))
	async publication(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: { waterMark: string; chatIdList: string }
	) {
		try {
			const waterMark = JSON.parse(body.waterMark);
			const chatIdList = body.chatIdList !== '' ? body.chatIdList.split(',') : [];

			const result = await this.postsService.publication(files, waterMark, chatIdList);

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

	@Put('edit-post-link-channels')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.EDIT_POSTS))
	async editPostLinkChannels(@Body() body: { postId: number; channelIds: number[] }) {
		try {
			const { postId, channelIds } = body;
			const result = await this.postsService.editPostLinkСhannels(postId, channelIds);

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

	@Post('instant-publication-posts')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.PUBLISH_POSTS))
	@UseInterceptors(FilesInterceptor('files[]'))
	async instantPublicationPosts(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: { waterMark: string; chatIdList: string }
	) {
		try {
			const waterMark = JSON.parse(body.waterMark);
			const chatIdList = body.chatIdList !== '' ? body.chatIdList.split(',') : [];

			const result = await this.postsService.instantPublicationPosts(
				files,
				waterMark,
				chatIdList
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

	@Get('receiving')
	@UseGuards(AuthGuard)
	async receiving(
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
		@Query('watched') watched: string,
		@Query('channel') channel: string
	) {
		try {
			const result = this.postsService.receiving(page, pageSize, watched, channel);

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
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.DELETE_POSTS))
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
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.PUBLISH_POSTS))
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

	@Get('delete-selected-imgs')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.DELETE_POSTS))
	async deleteSelectedImgs(@Query() query: { idList: IImageBlock[] }) {
		try {
			const { idList } = query;
			const result = await this.postsService.deleteSelectedImgs(idList);
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
