/**
 * Возвращает функцию c функционалом отложенного вызова
 *
 * @param {function} fnc - Функция, которую необходимо вызывать
 * @param {number} delay - Задержка между вызовом функции-обертки и фактическим вызовом переданной функции
 * @returns {(function(...[*]): void)|*} Функция-обертка. Вызовет переданную функцию только после ``delay`` мс после последнего вызова обертки
 *
 * @example
 * const debouncedConsoleLog = debounce(console.log, 500);
 * debouncedConsoleLog('first');
 * debouncedConsoleLog('second');
 * setTimeout(() => { debouncedConsoleLog('final') }, 600);
 * // Console:
 * // second
 * // final
 * // first не вывелся, потому что между первым и вторым вызовом debouncedConsoleLog прошло менее 500мс
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
