import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @Post('publication')
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
}
