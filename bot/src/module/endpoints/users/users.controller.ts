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
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersDto } from './dto/user.dto';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/const/const';

@Controller('user')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post('create-user')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_USERS))
	async createUser(@Body() createUserDto: { name: string; password: string }) {
		try {
			const { name, password } = createUserDto;
			const result = await this.userService.createUser(name, password);
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
	async login(@Query('name') name: string) {
		try {
			const result = await this.userService.login(name);
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
			const result = await this.userService.checkDataWeb(request.authData.id);
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
			return await this.userService.updateAccessToken(refreshToken);
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

	@Put('update-data-user')
	@UseGuards(AuthGuard)
	async updateDataUsers(@Body() data: UsersDto) {
		try {
			return await this.userService.updateDataUsers(data);
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
			return await this.userService.getUsersList(Number(page), Number(limit));
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
			return await this.userService.deleteUser(Number(id));
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
