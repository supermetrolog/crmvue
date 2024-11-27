/**
 * @function parts
 * @description Разбивает массив на ``size`` массивов с максимально возможным одинаковым количеством элементов
 *
 * @param {*[]} array - Массив для распределения
 * @param {number} size - Количество массивов
 * @returns {*[][]} - Массив с указанным количеством массивов, полученных при распрделении переданного
 *
 * @example
 * const blocks = parts([1, 2, 3, 4, 5, 6, 7, 8], 3);
 * // blocks = [[1, 4, 7], [2, 5, 8], [3, 6]]
 *
 * @example
 * const blocks = parts([1, 2, 3, 4], 6);
 * // blocks = [[1], [2], [3], [4]]
 */

export const parts = (array, size) => {
    const result = Array.from(Array(Math.min(array.length, size)), () => []);

    for (let i = 0; i < array.length; i++) {
        result[i % size].push(array[i]);
    }

    return result;
};
