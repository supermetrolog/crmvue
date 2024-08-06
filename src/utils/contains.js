/**
 * Различные функции для работы с проверкой на содержание элементов одного массива в другом
 */
export const contains = {
    /**
     * @function any
     * @description Проверяет, находится ли **хотя бы один** элемент второго массива в первом
     * @param {(string|number|boolean)[]} target - Первый массив
     * @param {(string|number|boolean)[]} pattern - Второй массив
     * @returns {boolean}
     *
     * @example
     * const hasRedOrYellowColor = contains.any(['red', 'yellow', 'orange'], ['red', 'blue']);
     * // hasRedOrYellowColor = true
     */
    any(target, pattern = []) {
        return pattern.some(word => {
            return target.some(element => element === word);
        });
    },
    /**
     * @function anyWithProperty
     * @description Проверяет, есть ли в первом массиве **хотя бы один объект**, свойство которого равно одного из значений второго массива
     * @param {Object[]} target - Массив объектов
     * @param {string|number} property - Название свойства для проверки
     * @param {(string|number|boolean)[]} pattern - Массив с значениями
     * @returns {boolean}
     *
     * @example
     * const hasRedOrYellowColor = contains.any([{color: 'red'}, {color: 'yellow'}, {color: 'orange'}], 'color', ['red', 'blue']);
     * // hasRedOrYellowColor = true
     */
    anyWithProperty(target, property, pattern = []) {
        return pattern.some(word => {
            return target.some(element => element[property] === word);
        });
    },
    /**
     * @function every
     * @description Проверяет, находятся ли **все** элементы второго массива в первом
     * @param {(string|number|boolean)[]} target - Первый масств
     * @param {(string|number|boolean)[]} pattern - Второй массив
     * @returns {this is *[]}
     *
     * @example
     * const hasAllColors = contains.every(['red', 'yellow', 'orange'], ['red', 'orange'])
     * // hasAllColors = true
     *
     * @example
     * const hasAllColors = contains.every(['red', 'yellow', 'orange'], ['red', 'orange', 'blue'])
     * // hasAllColors = false
     */
    every(target, pattern = []) {
        return pattern.every(word => {
            return target.some(element => element === word);
        });
    }
};
