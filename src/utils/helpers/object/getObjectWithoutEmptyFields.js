import { cloneObject } from '@/utils/helpers/object/cloneObject.js';

/**
 * @function getObjectWithoutEmptyFields.js
 * @description Возвращает новый объект, в котором удалены все пустые свойства переданного (``undefined``, ``null``, ``''``, ``[]``)
 * @param {Object} _object - Объект для обработки
 * @returns {Object} - Объект без пустых свойств
 *
 * @example
 * const query = { price: null, value: 10, items: [] };
 * const cleanQuery = getObjectWithoutEmptyFields.js(query);
 * // cleanQuery = { value: 10 }
 */
export function getObjectWithoutEmptyFields(_object) {
    const object = cloneObject(_object);

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && !value.length)
            ) {
                delete object[key];
            }
        }
    }

    return object;
}
