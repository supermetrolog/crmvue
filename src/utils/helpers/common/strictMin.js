/**
 * @function strictMin
 * @description Возвращает строгий минимум (``!== 0`` и ``!== null``) из массива
 *
 * @param {number} args - Массив чисел
 * @returns {number} - Строгий минимум из массива
 *
 * @example
 * const minValue = strictMin(6, null, 4, 0, 3);
 * // minValue = 3
 */
export const strictMin = (...args) => {
    return Math.min(...args.filter(element => element !== 0 && element !== null));
};
