export interface userData {
	id: number;
	name: string;
	role: string;
	avatarUrl?: string;
	telegramId?: string;
	isTeamMember?: boolean;
	coin: number;
}

export interface IAppStore {
	userData: userData | null;
	auth: boolean;
	width: number;
	height: number;
	isLoading: boolean;
	data: any;
}
