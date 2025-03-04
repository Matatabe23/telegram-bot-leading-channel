import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineUserService } from './online-user/online-user.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ namespace: 'ws', cors: { origin: '*' } })
export class WebSocketMainGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(private readonly onlineUserService: OnlineUserService) {}

	handleConnection(client: Socket) {
		console.log(`🔵 Клиент подключился: ${client.id}`);
		this.onlineUserService.addClient(client.id);
	}

	handleDisconnect(client: Socket) {
		console.log(`🔴 Клиент отключился: ${client.id}`);
		this.onlineUserService.removeClient(client.id);
	}

	@OnEvent('onlineUsersUpdated')
	handleOnlineUsersUpdate(count: number) {
		this.server.emit('onlineUsers', count);
	}

	@SubscribeMessage('requestOnlineUsersUpdate')
	handleRequestOnlineUsersUpdate() {
		const onlineCount = this.onlineUserService.getOnlineUsers();

		this.server.emit('onlineUsers', onlineCount);
	}
}
