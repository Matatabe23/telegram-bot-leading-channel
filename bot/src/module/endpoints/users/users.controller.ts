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
	Param,
	Post
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersDto } from './dto/user.dto';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserData } from './decorators/update-data-user.decorator';
import { GetUsersList } from './decorators/get-users-list.decorator';
import { DeleteUser } from './decorators/delete-post.decorator';
import { RefreshTokenDoc } from './decorators/refresh-token.decorator';
import { LogoutDoc } from './decorators/logout.decorator';
import { GetProfileDoc } from './decorators/get-profile.decorator';
import { LoginDoc } from './decorators/login-user.decorator';
import { LoginUserDto } from './dto/login.dto';
import { GetRefreshSessionsDocs } from './decorators/get-refresh-sessions.decorator';
@Controller('user')
@ApiTags('Пользователи')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post('login')
	@LoginDoc()
	async login(@Body() dto: LoginUserDto, @Req() req: Request) {
		try {
			const result = await this.userService.login(dto, req);
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

	@Post('refresh-token')
	@RefreshTokenDoc()
	async updateAccessToken(@Body('refreshToken') token: string) {
		try {
			return await this.userService.refreshAccessToken(token);
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

	@Post('logout')
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard)
	@LogoutDoc()
	async logout(@Body('refreshToken') token: string) {
		return this.userService.logout(token);
	}

	@Get('me')
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard)
	@GetProfileDoc()
	async getProfile(@Req() req: any) {
		return this.userService.getProfile(req.user.id);
	}

	@Put('update-data-user')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('access-token')
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
	@ApiBearerAuth('access-token')
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

	@Get('me/tokens')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('access-token')
	@GetRefreshSessionsDocs()
	async getRefreshTokens(@Req() req) {
		try {
			return await this.userService.getRefreshTokens(req.user.id);
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
	@ApiBearerAuth('access-token')
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
