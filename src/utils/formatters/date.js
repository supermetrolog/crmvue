import dayjs from 'dayjs';

/**
 * Convert date in Moscow timezone from string to dayjs-object in local time
 *
 * @param {string} stringDate
 * @return {dayjs.Dayjs}
 */
export function dayjsFromMoscow(stringDate) {
    return dayjs(stringDate.replace(/-/g, '/') + 'Z+3', 'YYYY/MM/DD HH:mm:ssZ');
}

/**
 * Преобразование в формат вывода даты
 *
 * @param {Date, string, number} date - дата
 * @param {string} format - формат вывода даты
 * @returns {string}
 */
export function toDateFormat(date, format = 'D.MM.YY, HH:mm') {
    if (typeof date === 'string') return dayjsFromMoscow(date).format(format);
    return dayjs(date).format(format);
}

export function toBeautifulDateFormat(date) {
    const dayjsDate = typeof date === 'string' ? dayjsFromMoscow(date) : dayjs(date);

    if (dayjsDate.isToday()) return `Сегодня в ${dayjsDate.format('HH:mm')}`;
    else if (dayjsDate.isYesterday()) return `Вчера в ${dayjsDate.format('HH:mm')}`;
    else if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    else return dayjsDate.format('D.MM.YY HH:mm');
}
