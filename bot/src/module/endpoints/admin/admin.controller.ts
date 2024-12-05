import {
	Controller,
	Get,
	Req,
	Query,
	HttpException,
	UseGuards,
	HttpStatus,
	Put,
	Body,
	Post,
	Delete,
	Param
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminDto } from './dto/admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/const/const';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post('create-user')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_USERS))
	async createUser(@Body() createUserDto: { name: string; password: string }) {
		try {
			const { name, password } = createUserDto;
			const result = await this.adminService.createUser(name, password);
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
	@UseGuards(AuthGuard)
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

	@Get('get-users-list')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_USERS))
	async getUsersList(@Query('page') page: number, @Query('limit') limit: number) {
		try {
			return await this.adminService.getUsersList(Number(page), Number(limit));
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
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_USERS))
	async deleteUser(@Param('id') id: number) {
		try {
			return await this.adminService.deleteUser(Number(id));
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

	@Put('update-password')
	@UseGuards(AuthGuard)
	async updatePassword(@Req() request: any, @Body() updatePasswordDto: UpdatePasswordDto) {
		const { oldPassword, newPassword } = updatePasswordDto;

		try {
			return await this.adminService.updatePassword(
				request.authData.id,
				oldPassword,
				newPassword
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
}
