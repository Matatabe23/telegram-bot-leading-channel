import { IAdminDto } from '../type/types.js';

export default class {
	id: number | null;
	name: string;
	role?: string;
  password?: string

	constructor(model: any) {
		this.id = model.id;
		this.name = model.name;
		this.role = model.role;
	}
}
