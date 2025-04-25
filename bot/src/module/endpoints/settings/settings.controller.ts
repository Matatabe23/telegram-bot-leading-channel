import {
	Controller,
	Post,
	Get,
	Delete,
	Put,
	Body,
	Query,
	Param,
	UseGuards,
	BadRequestException
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { updateChannel } from './decorators/update-channel.decorator';
import { ApiTags } from '@nestjs/swagger';
import { getChannel } from './decorators/get-channel.decorator';
import { DeleteTime } from './decorators/delete-time.decorator';
import { channelCreate } from './decorators/channel-create.decorator';
import { GetListChannel } from './decorators/get-list-channel.decorator';
import { DeleteChannel } from './decorators/delete-channel.decorator';

@Controller('settings')
@ApiTags('Настройки')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post('channel/create')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	@channelCreate()
	async channelCreate(@Body() body) {
		try {
			const { name, chatId } = body;
			const result = await this.settingsService.channelCreate(name, chatId);
			return result;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('channel/list')
	@UseGuards(AuthGuard)
	@GetListChannel()
	async getListChannel() {
		try {
			const list = await this.settingsService.getListChannel();
			return list;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('channel/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	@getChannel()
	async getChannel(@Query('id') id: number) {
		try {
			const list = await this.settingsService.getChannel(id);
			return list;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put('channel/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	@updateChannel()
	async updateFullChannel(@Param('id') id: number, @Body() body) {
		try {
			const result = await this.settingsService.updateChannel(+id, body);
			return result;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete('channel/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.CREATE_CHANNEL))
	@DeleteChannel()
	async deleteChannel(@Param('id') id: string) {
		try {
			const result = await this.settingsService.deleteChannel(id);
			return result;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete('time/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.SET_PUBLICATION_TIME))
	@DeleteTime()
	async deleteTime(@Param('id') id: string) {
		try {
			const result = await this.settingsService.deleteTime(id);
			return result;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}
