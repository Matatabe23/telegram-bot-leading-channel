import { IAdminDto } from '../types'

module.exports = class AdminDto {
	id: number;
	name: string;
	role: string;


	constructor(model: IAdminDto) {
		this.id = model.id
		this.name = model.name;
		this.role = model.role;
	}
}