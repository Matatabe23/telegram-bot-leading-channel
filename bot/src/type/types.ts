export interface IPublishTime {
	hour: number;
	minute: number;
}

export interface IAdminDto {
	id: number | null;
	name: string;
	role?: string;
	password?: string;
}

export interface IImageBlock {
	id: number;
	image: string;
	dataBasePostId: number;
}

export enum IEditChannelType {
	PRIVATED = 'privated'
}
