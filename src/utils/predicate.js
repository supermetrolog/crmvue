/**
 * @function compareByProperty
 * @description Вернет функцию для использования с ``Array.sort()``
 *
 * @param {string|number} property - Название свойства объекта, по которому будет происходить сравнение
 * @returns {function(Object, Object): (1|-1|0)}
 */
const compareByProperty = property => (first, second) => {
    if (first[property] > second[property]) return 1;
    if (first[property] < second[property]) return -1;
    return 0;
};

export const predicate = {
    compareByProperty
};
