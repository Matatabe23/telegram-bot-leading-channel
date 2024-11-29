import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('main-info')
	@UseGuards(AuthGuard)
	getHello() {
		return this.appService.getMainInfo();
	}
}
