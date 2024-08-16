import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  HttpException,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('login')
  async login(
    @Query('name') name: string,
    @Query('password') password: string,
  ) {
    try {
      const result = await this.adminService.login(name, password);
      return result;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
