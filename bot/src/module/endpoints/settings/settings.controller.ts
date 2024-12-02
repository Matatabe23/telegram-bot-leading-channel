import {
	Controller,
	Post,
	Get,
	Delete,
	Put,
	Body,
	Query,
	Param,
	Res,
	UseGuards,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { SettingsService } from './settings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/const/const';

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post('addingPublicationTime')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	async addingPublicationTime(@Body() body, @Res() res: Response) {
		try {
			const { hour, minute, channelId } = body;
			const result = await this.settingsService.addingPublicationTime(
				hour,
				minute,
				channelId
			);
			res.json(result);
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

	@Get('getListRegularPublicationTimes')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	async getListRegularPublicationTimes(
		@Query('channelId') channelId: string,
		@Res() res: Response
	) {
		try {
			const list = await this.settingsService.getListRegularPublicationTimes(channelId);
			res.json(list);
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

	@Delete('deleteItemPublicationTimes/:id')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	async deleteItemPublicationTimes(@Param('id') id: string, @Res() res: Response) {
		try {
			const result = await this.settingsService.deleteItemPublicationTimes(id);
			res.json(result);
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

	@Post('addingNewChannels')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	async addingNewChannels(@Body() body, @Res() res: Response) {
		try {
			const { name, chatId } = body;
			const result = await this.settingsService.addingNewChannels(name, chatId);
			res.json(result);
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

	@Get('getListChannel')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	async getListChannel(@Res() res: Response) {
		try {
			const list = await this.settingsService.getListChannel();
			res.json(list);
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

	@Delete('deleteChannel/:id')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	async deleteChannel(@Param('id') id: string, @Res() res: Response) {
		try {
			const result = await this.settingsService.deleteChannel(id);
			res.json(result);
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

	@Put('editChannel')
	@UseGuards(AuthGuard)
	@UseGuards(CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	async editChannel(@Body() body, @Res() res: Response) {
		try {
			const { id, settings } = body;
			const result = await this.settingsService.editChannel(id, settings);
			res.json(result);
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
