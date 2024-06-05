import { alg } from '@/utils/alg.js';

export const reducer = {
    /**
     * @function reducer.sum
     * @description Возвращает сумму всех свойств из ``fields`` для объектов массива ``element``.
     *
     * @example
     * const value = reducer.sum([{a: 2, b: 1}, {a: 0: b: 4}], ['a', 'b']);
     * // value = 7
     *
     * @example
     * const value = reducer.sum([3, 2, 1, 4]);
     * // value = 10
     *
     * @param {*[]} element - Массив, элементы которого необходимо сложить
     * @param {string|number|string[]|number[]} [fields = null] - Список названий свойств или только одно свойство
     * @returns {number} Сумма значений свойств
     */
    sum: (element, fields = null) => {
        if (fields === null) return element.reduce((acc, el) => acc + el, 0);
        if (fields instanceof Array)
            return element.reduce(
                (acc, el) => acc + fields.reduce((_acc, field) => _acc + el[field] ?? 0, 0),
                0
            );

        return element.reduce((acc, el) => acc + el[fields], 0);
    },
    /**
     * @function reducer.min
     *
     * @description Возвращает минимум для свойства ``field`` среди всех элементов массива ``element``
     *
     * @example
     * const minValue = reducer.min([{a: 2, b: 1}, {a: 0: b: 4}], 'a');
     * // minValue = 0
     *
     * @example
     * const minValue = reducer.min([3, 2, 1, 4]);
     * // minValue = 1
     *
     * @param {Object[]|number[]} element - Массив элементов
     * @param {string|number} [field = null] - Свойство, минимум которого необходимо вычислить
     * @returns {number|null} - Минимум среди всех элементов
     */
    min: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return Math.min(...element);

        return element.reduce((acc, el) => Math.min(acc, el[field]), element[0][field]);
    },
    /**
     * @function reducer.max
     *
     * @description Возвращает максимум для свойства ``field`` среди всех элементов массива ``element``
     *
     * @example
     * const maxValue = reducer.max([{a: 2, b: 1}, {a: 0: b: 4}], 'b');
     * // maxValue = 4
     *
     * @example
     * const maxValue = reducer.max([3, 2, 1, 4]);
     * // maxValue = 4
     *
     * @param {Object[]|number[]} element - Массив элементов
     * @param {string|number} [field = null] - Свойство, максимум которого необходимо вычислить
     * @returns {number|null} - Максимум среди всех элементов
     */
    max: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return Math.max(...element);

        return element.reduce((acc, el) => Math.max(acc, el[field]), element[0][field]);
    },
    /**
     * @function reducer.strictMin
     *
     * @description Возвращает строгий минимум (> 0 и !== null) для ``field`` среди всех элементов массива ``element``
     *
     * @example
     * const minValue = reducer.strictMin([{a: 2, b: 1}, {a: 0: b: 4}], 'a');
     * // minValue = 2
     *
     * @example
     * const minValue = reducer.strictMin([3, 0, 1, null]);
     * // minValue = 1
     *
     * @example
     * const minValue = reducer.strictMin({a: 2, b: 1}, {a: 0: b: null}, ['a', 'b']);
     * // minValue = 1
     *
     * @param {Object[]|number[]} element - Массив элементов
     * @param {string|number|string[]|number[]} [field = null] - Свойство или массив свойств, минимум которого необходимо вычислить
     * @returns {number|null} - Минимум среди всех элементов
     */
    strictMin: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return alg.strictMin(...element);
        if (field instanceof Array) {
            const defaultMinValue = reducer.strictMin(field.map(_field => element[0][_field]));

            return element.reduce(
                (acc, el) => alg.strictMin(acc, ...field.map(_field => el[_field])),
                defaultMinValue
            );
        }

        return element.reduce((acc, el) => alg.strictMin(acc, el[field]), element[0][field]);
    }
};
