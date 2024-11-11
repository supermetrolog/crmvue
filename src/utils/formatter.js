import { alg } from '@/utils/alg.js';
import dayjs from 'dayjs';
import { dayjsFromMoscow } from '@/utils/index.js';

/**
 * Сформировать название компании
 *
 * @param {object} company - Компания
 * @param {number} companyID - ID компании
 * @returns {string} - Название компании
 */
export const getCompanyName = (company, companyID) => {
    if (!company || company?.noName) return 'Компания #' + companyID;

    if (company.full_name) return company.full_name;

    if (alg.isNumeric(company.nameRu)) return 'Компания №' + company.nameRu;

    let companyName = company.nameRu;
    if (company.nameEng) companyName += ' - ' + company.nameEng;

    return companyName;
};

export function getContactFullName(contact) {
    if (contact.full_name) return contact.full_name;
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
}

/**
 * Преобразовать первую букву слова в заглавную
 *
 * @param {string} string - Строка
 * @param {boolean} full - Преобразовать ли каждое новое словое в строке
 * @returns {string}
 */
export function ucFirst(string, full = false) {
    if (full) return string.replace(/(\s|^)[а-яё]/g, letter => letter.toUpperCase());
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Преобразование числа к локальному выводу (Intl)
 *
 * @param {number|string} number - Число
 * @param {string} [lang = ru] - Локаль для преобразования
 * @param {object} options - Конфиг для Intl
 * @returns {string}
 */
export function toNumberFormat(number, lang = 'ru', options = {}) {
    return new Intl.NumberFormat(lang, options).format(number);
}

/**
 * Преобразование двух чисел или к интервалу локального вывода или к одному числу в локальном выводе
 *
 * @param {number|string} valueMin - Возможное левое значение интервала
 * @param {number|string} valueMax - Возможное правое значение интервала
 * @returns {string} - Интервал или одно число
 */
export function toNumberOrRangeFormat(valueMin, valueMax) {
    if (valueMin === valueMax) return toNumberFormat(valueMin);
    return toNumberFormat(valueMin) + ' - ' + toNumberFormat(valueMax);
}

/**
 * Преобразование полного имени в иницицалы
 *
 * @param {string} full_name - ФИО или ФИ
 * @returns {string}
 */
export function toInitialsFormat(full_name) {
    return full_name
        .split(' ')
        .slice(0, 2)
        .reduce((acc, element) => (acc += element[0] !== '(' ? element[0] : ''), '');
}

export function toCorrectFormat(value) {
    if (alg.isNumeric(value)) toNumberFormat(value);
    return value;
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

/**
 * Преобразование в корректный URL (добавление https:// в случае отсутствия)
 *
 * @param {string} url Некорректный или корректный URL
 * @return {string} Корректный URL
 */
export function toCorrectUrl(url) {
    if (url.match(/^https?:\/\//)) return url;
    return 'https://' + url;
}

const sizeUnits = [
    { id: 1, label: 'б', name: 'byte' },
    { id: 2, label: 'Кб', name: 'kilobyte' },
    { id: 3, label: 'Мб', name: 'megabyte' },
    { id: 4, label: 'Гб', name: 'gigabyte' },
    { id: 5, label: 'Тб', name: 'terabyte' },
    { id: 6, label: 'Пб', name: 'petabyte' }
];
/**
 * Преобразование размера файла к наибольшей единице измерения
 *
 * @param {number} size - Оргиниальный размер в байтах
 * @returns {string}
 */
export function toFileSizeFormat(size) {
    let i = 0;

    while ((size / 1000) | 0 && i < sizeUnits.length - 1) {
        size /= 1024;
        i++;
    }

    return size.toFixed(2) + ' ' + sizeUnits[i].label;
}

export function toBoldHTML(text) {
    return '<b>' + text + '</b>';
}
