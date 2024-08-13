import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  Put,
  Get,
  HttpStatus,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { IImageBlock } from 'src/type/types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('publication')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files[]'))
  async publication(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { waterMark: string; chatIdList: string },
  ) {
    try {
      const waterMark = JSON.parse(body.waterMark);
      const chatIdList =
        body.chatIdList !== '' ? body.chatIdList.split(',') : [];

      const result = await this.postsService.publication(
        files,
        waterMark,
        chatIdList,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('editPostLinkChannels')
  @UseGuards(AuthGuard)
  async editPostLinkChannels(
    @Body() body: { postId: number; channelIds: number[] },
  ) {
    try {
      const { postId, channelIds } = body;
      const result = await this.postsService.editPostLinkСhannels(
        postId,
        channelIds,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('instantPublicationPosts')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files[]'))
  async instantPublicationPosts(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { waterMark: string; chatIdList: string },
  ) {
    try {
      const waterMark = JSON.parse(body.waterMark);
      const chatIdList =
        body.chatIdList !== '' ? body.chatIdList.split(',') : [];

      const result = await this.postsService.instantPublicationPosts(
        files,
        waterMark,
        chatIdList,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('receiving')
  @UseGuards(AuthGuard)
  async receiving(
    @Query('page') page: number,
    @Query('page') pageSize: number,
    @Query('page') watched: string,
    @Query('page') channel: string,
  ) {
    try {
      const result = this.postsService.receiving(
        page,
        pageSize,
        watched,
        channel,
      );

      return { ...result };
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('deletePost/:id')
  @UseGuards(AuthGuard)
  async deletePost(@Query('id') id: number) {
    try {
      const result = await this.postsService.deletePost(id);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('publishInstantly/:id')
  @UseGuards(AuthGuard)
  async publishInstantly(@Query('id') id: number) {
    try {
      const result = await this.postsService.publishInstantly(id);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('receivingPost/:id')
  @UseGuards(AuthGuard)
  async receivingPost(@Query('id') id: number) {
    try {
      const result = await this.postsService.receivingPost(id);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('changePage/:id')
  @UseGuards(AuthGuard)
  async changePage(
    @Param('id') id: number,
    @Query('where') where?: string,
    @Query('watched') watched?: string,
  ) {
    try {
      const result = await this.postsService.changePage(id, where, watched);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('deleteSelectedImgs')
  @UseGuards(AuthGuard)
  async deleteSelectedImgs(@Body() body: { idList: IImageBlock[] }) {
    try {
      const { idList } = body;
      const result = await this.postsService.deleteSelectedImgs(idList);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
