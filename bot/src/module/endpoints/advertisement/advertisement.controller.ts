import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Put,
	Query,
	UseGuards
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { AdvertisementDto } from './dto/advertisement.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAdvertisements } from './decorators/update-advertisements.decorators';

@Controller('advertisements')
@ApiTags('Реклама')
export class AdvertisementController {
	constructor(private readonly advertisementsService: AdvertisementService) {}

	@Get('get-advertisements')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ADVERTISEMENTS))
	@UpdateAdvertisements()
	async createNewRole(
		@Query('page') page: number,
		@Query('perpage') perpage: number,
		@Query('sortBy') sortBy: string,
		@Query('sortOrder') sortOrder: 'ASC' | 'DESC'
	) {
		try {
			return this.advertisementsService.getAdvertisements(
				Number(page) || 1,
				Number(perpage) || 10,
				sortBy ? sortBy : 'id',
				sortOrder ? sortOrder : 'ASC'
			);
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

	@Put('update-advertisement')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ROLES))
	@UpdateAdvertisements()
	async updateAdvertisement(@Body('advertisement') advertisement: AdvertisementDto) {
		try {
			return this.advertisementsService.updateAdvertisement(advertisement);
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
