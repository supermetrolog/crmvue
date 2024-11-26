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
export const extractPropertiesFromObject = (object, properties) => {
    return properties.reduce((acc, property) => ({ ...acc, [property]: object[property] }), {});
};
