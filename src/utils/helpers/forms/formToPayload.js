/**
 * Выборка только нужных свойств перед отправкой запроса
 *
 * @param {object} form
 * @param {array} template
 * @returns {object}
 */
export function formToPayload(form, template) {
    return template.reduce((acc, key) => {
        if (form[key] !== undefined) acc[key] = form[key];

        return acc;
    }, {});
}
