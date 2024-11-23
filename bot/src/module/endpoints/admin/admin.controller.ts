import {
	Controller,
	Get,
	Req,
	Query,
	HttpException,
	UseGuards,
	HttpStatus,
	Put,
	Body
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get('login')
	async login(@Query('name') name: string, @Query('password') password: string) {
		try {
			const result = await this.adminService.login(name, password);
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

	@Get('check-data')
	@UseGuards(AuthGuard)
	async checkDataWeb(@Req() request: any) {
		try {
			const result = await this.adminService.checkDataWeb(request.authData.id);
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

	@Get('update-access-token')
	async updateAccessToken(@Query('refreshToken') refreshToken: string) {
		try {
			return await this.adminService.updateAccessToken(refreshToken);
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

	@Put('update-data-admin')
	async updateDataAdmin(@Body() data: AdminDto) {
		try {
			return await this.adminService.updateDataAdmin(data);
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
