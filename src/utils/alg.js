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
const strictMin = (...args) => {
    return Math.min(...args.filter(element => element !== 0 && element !== null));
};

/**
 * @function filterArrayByPropertyEntity
 * @description Сгруппирует элементы массива по указанному свойству
 *
 * @param {Object[]} array - Массив с элементами
 * @param {string|number} property - Свойство, по которому происходит группировка
 * @returns {Object} - Оъект с группами элементов
 *
 * @example
 * const animals = [
 *  { color: 'orange', name: 'Missy' },
 *  { color: 'orange', name: 'Chappy' },
 *  { color: 'yellow', name: 'Potty' },
 *  { color: 'red', name: 'Olly' }
 * ]
 *
 * const groupedByColorAnimals = filterArrayByPropertyEntity(animals, 'color');
 * // groupedByColorAnimals = {
 * //   orange: [
 * //       {color: 'orange', name: 'Missy'},
 * //       {color: 'orange', name: 'Chappy'}
 * //   ],
 * //   yellow: [
 * //       {color: 'yellow', name: 'Potty'}
 * //   ],
 * //   red: [
 * //       {color: 'red', name: 'Olly'}
 * //   ]
 * // }
 */
const filterArrayByPropertyEntity = (array, property) => {
    return array.reduce((acc, element) => {
        if (element[property] in acc) acc[element[property]].push(element);
        else acc[element[property]] = [element];

        return acc;
    }, {});
};

const extractObject = (obj, prop) => {
    if (prop.length > 1) {
        if (obj[prop[0]] instanceof Array)
            return obj[prop[0]].reduce(
                (acc, element) => [...acc, ...extractObject(element, prop.slice(1))],
                []
            );

        return extractObject(obj[prop[0]], prop.slice(1));
    }

    if (obj[prop[0]] instanceof Array) return obj[prop[0]];

    return [obj[prop[0]]];
};

/**
 * @function extractDeepProperty
 * @description
 *
 * @param {Object} object - Объект, свойства которого необходимо деструктурировать
 * @param {string|string[]} properties - Названия свойств для декструктуризации. Для углубления внутрь объектов перечислите свойства через точку
 * @returns {*[]|(*|*[])[]}
 *
 *  @example
 *
 *  const complex = {
 *      objects: [1, 2, 3],
 *      floors: [
 *          { id: 1, cabinets: [
 *              { name: 'Math' },
 *              { name: 'Informatics' }
 *            ]
 *          },
 *          { id: 2, cabinets: [
 *              { name: 'Library' },
 *              { name: 'Director' }
 *            ]
 *          }
 *      ]
 *  }
 *
 *  const [objects, cabinets] = extractDeepProperty(complex, ['objects', 'floors.cabinets'])
 *  // objects = [1, 2, 3]
 *  // cabinets = [{name: 'Math'}, {name: 'Informatics'}, {name: 'Library'}, {name: 'Director'}]
 */
const extractDeepProperty = (object, properties) => {
    if (properties instanceof Array) {
        return properties.map(propertiesItem => extractObject(object, propertiesItem.split('.')));
    }

    return extractObject(object, properties.split('.'));
};

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
const chunk = (array, size) => {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
};

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

const parts = (array, size) => {
    const result = Array.from(Array(Math.min(array.length, size)), () => []);

    for (let i = 0; i < array.length; i++) {
        result[i % size].push(array[i]);
    }

    return result;
};

/**
 * @function extractPropertiesFromObject
 * @description Выбирает из переданного объекта заданные свойства и возвращает в новом сформированном объекте
 *
 * @param {Object} object - Обрабатываемый объект
 * @param {(string|number)[]} properties - Список названий свойств
 * @returns {Object}
 *
 * @example
 * const complex = { price: 10, floors: 3, deal_type: 1, objects: [1, 2, 3], services: null }
 * const props = extractPropertiesFromObject(complex, ['floors', 'objects', 'services']);
 * // props = { floors: 3, objects: [1, 2, 3], services: null }
 */
const extractPropertiesFromObject = (object, properties) => {
    return properties.reduce((acc, property) => ({ ...acc, [property]: object[property] }), {});
};

/**
 * @function isNumeric
 * @description Проверяет, является ли переданный параметр числом
 *
 * @param {*} num
 * @returns {boolean}
 */
const isNumeric = num => {
    return !isNaN(+num);
};

export const alg = {
    strictMin,
    filterArrayByPropertyEntity,
    extractDeepProperty,
    chunk,
    extractPropertiesFromObject,
    isNumeric,
    parts
};
