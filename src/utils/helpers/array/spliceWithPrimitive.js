/**
 * Remove element in array using `array.splice()` (only primitives)
 *
 * @param {(number|string|boolean)[]} array
 * @param {number|string|boolean} value
 */
export function spliceWithPrimitive(array, value) {
    const index = array.findIndex(element => element === value);
    if (index !== -1) array.splice(index, 1);
}