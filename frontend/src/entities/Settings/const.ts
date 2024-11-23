import { EWatched } from "../PostData";

export const watchedOptions = [
    { value: '', title: 'Нечего' },
    { value: EWatched.watched, title: 'Просмотренные' },
    { value: EWatched.unwatched, title: 'Не просмотренные' }
];

export const perPage = [
    { value: '3', label: '3' },
    { value: '5', label: '5' },
    { value: '10', label: '10' }
];

export const settingsSelectPublish = [
    { value: 'waterMark', title: 'Водяной знак', subtitle: 'Engineering', },
    { value: 'instantPublication', title: 'Опубликовать сразу', subtitle: 'Engineering', },
];