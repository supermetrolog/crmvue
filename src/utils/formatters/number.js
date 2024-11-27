import {alg} from "@/utils/alg.js";

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

export function toCorrectFormat(value) {
    if (alg.isNumeric(value)) toNumberFormat(value);
    return value;
}