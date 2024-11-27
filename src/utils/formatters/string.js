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
 * Преобразование в корректный URL (добавление https:// в случае отсутствия)
 *
 * @param {string} url Некорректный или корректный URL
 * @return {string} Корректный URL
 */
export function toCorrectUrl(url) {
    if (url.match(/^https?:\/\//)) return url;
    return 'https://' + url;
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