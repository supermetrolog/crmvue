/**
 * @description Возвращает глубокую копию объекта
 * @param {Object|*[]} object - Объект для копирования
 * @returns {any} - Скопированный объект
 */
export function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}
