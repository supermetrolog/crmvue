/**
 * @function deleteObjectsWithEmptyProperties
 * @description Возвращает новый массив, в котором удаляет из массива объекты, заданное свойство которых пустое (``null``, ``[]``) или равно указанному значению
 *
 * @param {Object[]} iterObject - Массив с объектами
 * @param {string|number|(string|number)[]} properties - Названия свойств
 * @param {number|string|boolean|null} [value=null] - Значение свойства
 * @param {Object} [options] - Дополнительные параметры
 * @param {boolean} options.strict=false - Удалять объект, если **все** указанные в ``properties`` свойства пустые или равны ``value``
 * @returns {Object[]}
 *
 * @example
 * const prices = deleteObjectsWithEmptyProperties([
 *  { price: 0 }, { price: null }, { price: [] },
 *  { price: 9 }, { price: 8 }, { price: [1, 5, 3] }],
 *  'price', 8)
 *
 *  // prices = [{ price: 9 }, { price: [1, 5, 3] }]
 *
 * @example
 * const prices = deleteObjectsWithEmptyProperties(
 *  [{ price: 0, count: 0 }, { price: null, count: 2 }, { price: [], count: null },
 *   { price: 9, count: 0 }, { price: 8, count: 10 }, { price: [1, 5, 3], count: 0 }
 *  ],
 *  ['price', 'count'],
 *  0,
 *  { strict: true })
 *
 *  // prices = [{ price: null, count: 2 }, { price: 9, count: 0 }, { price: 8, count: 10 }, { price: [1, 5, 3], count: 0 } ]
 *  // Удалил элементы, в которых пустые И price И count
 */
export function deleteObjectsWithEmptyProperties(
    iterObject,
    properties,
    value = null,
    options = { strict: false }
) {
    if (properties instanceof Array)
        return iterObject.reduce((acc, element) => {
            const countPropertiesAfterPredicate = properties.filter(
                property =>
                    element[property] == value ||
                    element[property] === null ||
                    (element[property] instanceof Array && !element[property].length)
            ).length;

            if (
                options.strict
                    ? countPropertiesAfterPredicate === properties.length
                    : countPropertiesAfterPredicate
            )
                return acc;
            return [...acc, element];
        }, []);

    return iterObject.filter(element => {
        if (element[properties] instanceof Array) return element[properties].length;
        return element[properties] != value && element[properties] !== null;
    });
}
