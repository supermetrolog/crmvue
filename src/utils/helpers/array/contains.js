/**
 * Проверяет, находится ли **хотя бы один** элемент второго массива в первом
 * @param {(string|number|boolean)[]} target - Первый массив
 * @param {(string|number|boolean)[]} pattern - Второй массив
 * @returns {boolean}
 *
 * @example
 * const hasRedOrYellowColor = contains.any(['red', 'yellow', 'orange'], ['red', 'blue']);
 * // hasRedOrYellowColor = true
 */
function any(target, pattern = []) {
    return pattern.some(word => {
        return target.some(element => element === word);
    });
}

/**
 * Проверяет, есть ли в первом массиве **хотя бы один объект**, свойство которого равно одного из значений второго массива
 * @param {Object[]} target
 * @param {string|number} property - Название свойства для проверки
 * @param {(string|number|boolean)[]} pattern - Массив с значениями
 * @returns {boolean}
 *
 * @example
 * const hasRedOrYellowColor = contains.any([{color: 'red'}, {color: 'yellow'}, {color: 'orange'}], 'color', ['red', 'blue']);
 * // hasRedOrYellowColor = true
 */
function anyWithProperty(target, property, pattern = []) {
    return pattern.some(word => {
        return target.some(element => element[property] === word);
    });
}

/**
 * Проверяет, находятся ли **все** элементы второго массива в первом
 * @param {(string|number|boolean)[]} target - Первый массив
 * @param {(string|number|boolean)[]} pattern - Второй массив
 * @returns {boolean}
 *
 * @example
 * const hasAllColors = contains.every(['red', 'yellow', 'orange'], ['red', 'orange'])
 * // hasAllColors = true
 *
 * @example
 * const hasAllColors = contains.every(['red', 'yellow', 'orange'], ['red', 'orange', 'blue'])
 * // hasAllColors = false
 */
function every(target, pattern = []) {
    return pattern.every(word => {
        return target.some(element => element === word);
    });
}

export const contains = {
    any,
    anyWithProperty,
    every
};
