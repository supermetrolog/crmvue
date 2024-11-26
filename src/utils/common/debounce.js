/**
 * @param {function} fnc
 * @param {number} delay
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(fnc, delay) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);

        const context = this;

        timeout = setTimeout(() => {
            timeout = null;
            fnc.apply(context, args);
        }, delay);
    };
}
