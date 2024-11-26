/**
 * @param {string|number} property
 * @returns {function(Object, Object): (1|-1|0)}
 */
export function compareByProperty(property) {
    return (first, second) => {
        if (first[property] > second[property]) return 1;
        if (first[property] < second[property]) return -1;
        return 0;
    };
}
