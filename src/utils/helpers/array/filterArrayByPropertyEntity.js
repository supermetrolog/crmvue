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
export const filterArrayByPropertyEntity = (array, property) => {
    return array.reduce((acc, element) => {
        if (element[property] in acc) acc[element[property]].push(element);
        else acc[element[property]] = [element];

        return acc;
    }, {});
};
