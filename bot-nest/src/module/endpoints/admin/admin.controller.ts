import {
  Controller,
  Get,
  Post,
  Body,
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
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException('Ошибка', 500);
    }
  }

  @Get('check-data')
  @UseGuards(AuthGuard)
  async checkDataWeb(@Query('id') id: number) {
    console.log(id);
    try {
      const result = await this.adminService.checkDataWeb(1);
      return result;
    } catch (e) {
      throw new HttpException('Ошибка', 500);
    }
  }
}
