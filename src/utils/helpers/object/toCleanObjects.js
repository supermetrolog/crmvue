/**
 * @function toCleanObject
 * @description Возвращает объект только с заполненными свойствами
 *
 * @param {Object} object - Объект, из которого нужно удалить свойства
 * @returns {Object|string[]} - Новый объект
 */
export function toCleanObject(object) {
    return Object.keys(object).reduce((acc, key) => {
        const value = object[key];

        if (
            !(
                value === null ||
                value === '' ||
                value === undefined ||
                (Array.isArray(value) && !value.length)
            )
        )
            acc[key] = value;

        return acc;
    }, {});
}
