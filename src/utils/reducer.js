import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { strictMin as strictMinHelper } from '@/utils/helpers/common/strictMin.js';

/**
 * Возвращает сумму всех свойств из ``fields`` для объектов массива ``elements``.
 *
 * @example
 * const value = reducer.sum([{a: 2, b: 1}, {a: 0: b: 4}], ['a', 'b']);
 * // value = 7
 *
 * @example
 * const value = reducer.sum([3, 2, 1, 4]);
 * // value = 10
 *
 * @param {*[]} elements - Массив, элементы которого необходимо сложить
 * @param {string|number|string[]|number[]} [fields = null] - Список названий свойств или только одно свойство
 * @returns {number}
 */
function sum(elements, fields = null) {
    if (isNullish(fields)) return elements.reduce((acc, el) => acc + el, 0);

    if (isArray(fields))
        return elements.reduce(
            (acc, el) => acc + fields.reduce((_acc, field) => _acc + el[field] ?? 0, 0),
            0
        );

    return elements.reduce((acc, el) => acc + el[fields], 0);
}

/**
 * Возвращает минимум для свойства ``field`` среди всех элементов массива ``elements``
 *
 * @example
 * const minValue = reducer.min([{a: 2, b: 1}, {a: 0: b: 4}], 'a');
 * // minValue = 0
 *
 * @example
 * const minValue = reducer.min([3, 2, 1, 4]);
 * // minValue = 1
 *
 * @param {Object[]|number[]} elements - Массив элементов
 * @param {null|string|number} field - Свойство, минимум которого необходимо вычислить
 * @returns {number|null}
 */
function min(elements, field = null) {
    if (isEmptyArray(elements)) return null;
    if (isNullish(field)) return Math.min(...elements);

    return elements.reduce((acc, el) => Math.min(acc, el[field]), elements[0][field]);
}

/**
 * Возвращает максимум для свойства ``field`` среди всех элементов массива ``elements``
 *
 * @example
 * const maxValue = reducer.max([{a: 2, b: 1}, {a: 0: b: 4}], 'b');
 * // maxValue = 4
 *
 * @example
 * const maxValue = reducer.max([3, 2, 1, 4]);
 * // maxValue = 4
 *
 * @param {Object[]|number[]} elements - Массив элементов
 * @param {null|string|number} field - Свойство, максимум которого необходимо вычислить
 * @returns {number|null}
 */
function max(elements, field = null) {
    if (isEmptyArray(elements)) return null;
    if (isNullish(field)) return Math.max(...elements);

    return elements.reduce((acc, el) => Math.max(acc, el[field]), elements[0][field]);
}

/**
 * @param {Object[]|number[]} elements - Массив элементов
 * @param {null|string|number} field - Свойство, максимум которого необходимо вычислить
 * @returns {number|null}
 */
function strictMin(elements, field = null) {
    if (isEmptyArray(elements)) return null;
    if (isNullish(field)) return strictMinHelper(...elements);

    if (isArray(field)) {
        const defaultMinValue = strictMin(field.map(_field => elements[0][_field]));

        return elements.reduce(
            (acc, el) => strictMinHelper(acc, ...field.map(_field => el[_field])),
            defaultMinValue
        );
    }

    return elements.reduce((acc, el) => strictMinHelper(acc, el[field]), elements[0][field]);
}

export const reducer = {
    sum,
    min,
    max,
    strictMin
};
