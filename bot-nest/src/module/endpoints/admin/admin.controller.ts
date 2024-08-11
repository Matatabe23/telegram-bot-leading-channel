import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  HttpException,
  UseGuards,
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
      console.log(e);
      throw new HttpException('Ошибка', 500);
    }
  }

  @Get('check-data')
  @UseGuards(AuthGuard)
  async checkDataWeb(@Req() request: any) {
    try {
      const result = await this.adminService.checkDataWeb(request.body.id);
      return result;
    } catch (e) {
      throw new HttpException('Ошибка', 500);
    }
  }
}
