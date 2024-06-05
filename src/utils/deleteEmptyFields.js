/**
 * @function deleteEmptyFields
 * @description Удаляет из объекта пустые свойства с помощью ``delete``
 *
 * @example
 * const query = { step: 1, page: null, all: '', users: [] };
 * const emptyFields = deleteEmptyFields(query);
 *
 * // emptyFields = ['page', 'all', 'users']
 * // query = { step: 1 }
 *
 *
 * @example
 * const query = { step: 1, page: null, all: '', users: [] };
 * const newQuery = deleteEmptyFields({...query}, true);
 *
 * // query не изменился
 * // newQuery = { step: 1 }
 *
 * @param {Object} object - Объект, из которого нужно удалить свойства
 * @param {Boolean} [withResult = false] - Нужно ли возвращать измененный объект
 * @returns {Object|string[]} - Измененный объект, если ``withResult = true``. Иначе список удаленых ключей
 */
export const deleteEmptyFields = (object, withResult = false) => {
    const deletedFields = [];

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (
                value === null ||
                value === '' ||
                value === undefined ||
                (Array.isArray(value) && !value.length)
            ) {
                delete object[key];
                if (!withResult) deletedFields.push(key);
            }
        }
    }

    return withResult ? object : deletedFields;
};
