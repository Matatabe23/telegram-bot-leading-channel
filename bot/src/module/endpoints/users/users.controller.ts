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
	Delete,
	Param
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersDto } from './dto/user.dto';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { ApiTags } from '@nestjs/swagger';
import { LoginUser } from './decorators/login-user.decorator';
import { CheckUserData } from './decorators/check-data-web.decorator';
import { UpdateAccessToken } from './decorators/update-access-token.decorator';
import { UpdateUserData } from './decorators/update-data-user.decorator';
import { GetUsersList } from './decorators/get-users-list.decorator';
import { DeleteUser } from './decorators/delete-post.decorator';
import { Request } from 'express';
@Controller('user')
@ApiTags('Пользователи')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get('login')
	@LoginUser()
	async login(@Query('name') name: string, @Req() req: Request) {
		try {
			const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			const userAgent = req.headers['user-agent'] || 'unknown';

			const result = await this.userService.login(name, ip, userAgent);
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
	@CheckUserData()
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
	@UpdateAccessToken()
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
	@UpdateUserData()
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
	@GetUsersList()
	async getUsersList(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('sortBy') sortBy: string,
		@Query('sortOrder') sortOrder: 'ASC' | 'DESC'
	) {
		try {
			return await this.userService.getUsersList(
				Number(page),
				Number(limit),
				search,
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

	@Delete('delete-post/:id')
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_USERS))
	@DeleteUser()
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
