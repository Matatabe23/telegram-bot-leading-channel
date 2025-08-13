export interface IHoliday {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
}

export interface ITags {
	id: number;
	name: string;
	postCount: number;
	holidays: IHoliday[];
}
