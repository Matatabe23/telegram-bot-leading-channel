import { EWatched } from "../PostData";

export const watchedOptions = [
    { value: '', title: 'Нечего' },
    { value: EWatched.watched, title: 'Просмотренные' },
    { value: EWatched.unwatched, title: 'Не просмотренные' }
];

export const perPage = [
    {  title: '4', value: 4, },
    { title: '5', value: 5,  },
    { title: '10', value: 10 }
];

export const settingsSelectPublish = [
    { value: 'waterMark', title: 'Водяной знак', subtitle: 'Engineering', },
    { value: 'instantPublication', title: 'Опубликовать сразу', subtitle: 'Engineering', },
];