/**
 * Обернуть одиночные элементы в массив, если они не являются массивом.
 * @param {object} obj
 * @param {string[]} keys
 */
export function singleToArrayByKeys(obj, keys) {
    keys.forEach(key => {
        if (Object.hasOwnProperty.call(obj, key) && !Array.isArray(obj[key])) obj[key] = [obj[key]];
    });
}
