import dayjs from 'dayjs';

export type dayjsDate = dayjs.Dayjs;

const SERVER_TIMEZONE = 'Europe/Moscow';
const SERVER_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function dayjsFromServer(stringDate: string) {
    return dayjs(stringDate + '+03', 'YYYY.MM.DD HH:mm:ssZZ');
}

export type MaybeDate = Date | string | number | null | undefined | dayjsDate;

export function toDateFormat(date: MaybeDate, format: string = 'D.MM.YY, HH:mm') {
    if (typeof date === 'string') return dayjsFromServer(date).format(format);
    return dayjs(date).format(format);
}

export function toBeautifulDateFormat(date: MaybeDate, format: string = 'D.MM.YY, HH:mm') {
    const dayjsDate = typeof date === 'string' ? dayjsFromServer(date) : dayjs(date);

    if (dayjsDate.isToday()) return `Сегодня в ${dayjsDate.format('HH:mm')}`;
    else if (dayjsDate.isYesterday()) return `Вчера в ${dayjsDate.format('HH:mm')}`;
    else if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    else return dayjsDate.format(format);
}

export function toServerDate(date: Date | dayjsDate | string) {
    return dayjs(date).tz(SERVER_TIMEZONE).format(SERVER_DATETIME_FORMAT);
}
