/**
 * @param {array} array
 * @param {function} filterFn
 * @param {string} separator
 * @return string
 */
export function joinWithFilter(array, filterFn, separator = ' ') {
    return array.filter(filterFn).join(separator);
}
