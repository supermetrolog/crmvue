import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import minMax from 'dayjs/plugin/minMax';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export function initDayjs() {
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);
    dayjs.extend(relativeTime);
    dayjs.extend(customParseFormat);
    dayjs.extend(minMax);
    dayjs.extend(duration);
    dayjs.locale('ru');
}
