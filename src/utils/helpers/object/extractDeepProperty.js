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
export const extractDeepProperty = (object, properties) => {
    if (properties instanceof Array) {
        return properties.map(propertiesItem => extractObject(object, propertiesItem.split('.')));
    }

    return extractObject(object, properties.split('.'));
};
