/**
 * @function chunk
 * @description Разбивает массив на чанки (блоки) с длинной ``size``
 *
 * @param {*[]} array - Массив, который необходимо разбить
 * @param {number} size - Размер чанка
 * @returns {*[][]} - Массив с чанками с размером ``size`` или менее
 *
 * @example
 * const parts = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
 * // parts = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 */
export const chunk = (array, size) => {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
};
