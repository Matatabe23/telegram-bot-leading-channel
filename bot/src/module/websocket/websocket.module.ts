import { Module } from '@nestjs/common';
import { WebSocketMainGateway } from './websocket.gateway';
import { OnlineUserService } from './online-user/online-user.service';

@Module({
	providers: [WebSocketMainGateway, OnlineUserService],
	exports: [OnlineUserService]
})
export class WebSocketModule {}
