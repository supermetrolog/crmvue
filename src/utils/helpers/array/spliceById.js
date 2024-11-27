/**
 * Remove element in array by `id` property in object using `array.splice()`
 *
 * @param {object[]} array
 * @param {number|string} id
 * @return {boolean} - Returns true if element with given id exist in array, otherwise false
 */
export function spliceById(array, id) {
    const index = array.findIndex(element => element.id === id);
    if (index !== -1) array.splice(index, 1);

    return index !== -1;
}