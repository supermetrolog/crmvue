import { alg } from '@/utils/alg.js';
import dayjs from 'dayjs';

/**
 * Сформировать название компании
 *
 * @param {object} company - Компания
 * @param {number} companyID - ID компании
 * @returns {string} - Название компании
 */
export const getCompanyName = (company, companyID) => {
    if (!company || company?.noName) return 'Компания #' + companyID;

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
    return dayjs(date).format(format);
}
