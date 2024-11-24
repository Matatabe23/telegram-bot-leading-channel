import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post('create-role')
	@UseGuards(AuthGuard)
	async createNewRole(@Body() body: { nameRole: string }) {
		try {
			return this.rolesService.createNewRole(body.nameRole);
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

	@Get('get-roles')
	@UseGuards(AuthGuard)
	async getRoles() {
		try {
			return this.rolesService.getRoles();
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

	@Delete('delete-role/:id')
	@UseGuards(AuthGuard)
	async deleteRole(@Param('id') id: number) {
		try {
			console.log(id);
			return this.rolesService.deleteRole(id);
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
