import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	UseGuards
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckPermissionsGuard } from 'src/guards/check-permissions.guard';
import { EPermissions } from 'src/types/types';
import { CreateRole } from './decorators/create-role.decorator';
import { GetRoles } from './decorators/get-roles.decorator';
import { DeleteRole } from './decorators/delete-role.decorator';
import { UpdatePermissions } from './decorators/update-permissions.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Роли')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post('create-role')
	@CreateRole()
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ROLES))
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
	@GetRoles()
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ROLES))
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
	@DeleteRole()
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ROLES))
	async deleteRole(@Param('id') id: number) {
		try {
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

	@Put('update-permissions/:id')
	@UpdatePermissions()
	@UseGuards(AuthGuard, CheckPermissionsGuard.withPermission(EPermissions.EDIT_ROLES))
	async updatePermissions(@Param('id') id: number, @Body('permissions') permissions: string) {
		try {
			return this.rolesService.updatePermissions(id, permissions);
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
