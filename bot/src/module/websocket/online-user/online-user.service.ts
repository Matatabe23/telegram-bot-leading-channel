import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OnlineUserService {
	private clients: Set<string> = new Set();

	constructor(private readonly eventEmitter: EventEmitter2) {}

	addClient(clientId: string) {
		this.clients.add(clientId);
		this.emitUpdate();
	}

	removeClient(clientId: string) {
		this.clients.delete(clientId);
		this.emitUpdate();
	}

	getOnlineUsers(): number {
		return this.clients.size;
	}

	private emitUpdate() {
		this.eventEmitter.emit('onlineUsersUpdated', this.getOnlineUsers());
	}
}
