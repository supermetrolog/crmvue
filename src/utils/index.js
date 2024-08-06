import sha256 from 'crypto-js/sha256';

/**
 * @function waitHash
 * @description Возвращает хэш данных
 * @param {*} data - Данные для хэширования
 * @returns {string} - Хэш данных
 *
 * @example
 * const originalQueryHash = waitHash($route.query);
 * const response = await api.get($route.query);
 *
 * if (originalQueryHash === waitHash($route.query) commit(response);
 *
 * // В данном примере сравнивается хэш текущих параметров в урле до запроса и после.
 * // Если в момент получения данных параметры были изменены, то и полученных данные уже не являются актуальными.
 * // И в случае, если хэш параметров отличается, данные просто не используются.
 */
export const waitHash = data => sha256(JSON.stringify(data)).toString();

export default {
    normalizeContactsForMultiselect(contacts) {
        let data = [];
        contacts.map(contact => {
            let array = [];

            contact.phones.map(item => {
                array.push({
                    label: item.phone,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 0,
                        value: item.phone
                    }
                });
            });
            contact.emails.map(item => {
                array.push({
                    label: item.email,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 1,
                        value: item.email
                    }
                });
            });
            data.push({
                label: contact.type ? 'Общий контакт' : contact.first_and_last_name,
                options: array
            });
        });
        return data;
    },
    normalizeContactsForMultiselectOnlyEmails(contacts) {
        let data = [];
        contacts.map(contact => {
            let array = [];

            contact.emails.map(item => {
                array.push({
                    label: item.email,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 1,
                        value: item.email
                    }
                });
            });
            if (!array.length) return;
            data.push({
                label: contact.type ? 'Общий контакт' : contact.first_and_last_name,
                options: array
            });
        });
        return data;
    },
    normalizeDataForCompanyForm(data) {
        data.contacts = data.contacts.find(item => item.type == 1);
        if (!data.contacts) {
            data.contacts = {
                emails: [],
                phones: [],
                websites: []
            };
            return data;
        }
        return data;
    },
    normalizeDataForUserForm(data) {
        delete data.password;
        delete data.created_at;
        return data;
    }
};

export const arrayDataMapper = (array, rules) => {
    const newArray = [];
    for (const key in array) {
        const object = array[key];
        if (typeof object !== 'object' || object === null) {
            throw 'element must be Object';
        }
        newArray.push(dataMapper(object, rules));
    }
    return newArray;
};
export const dataMapper = (object, rules) => {
    const newObject = { ...object };

    for (const key in rules) {
        if (Object.hasOwnProperty.call(rules, key) && Object.hasOwnProperty.call(newObject, key)) {
            const newKey = rules[key];
            if (typeof newKey === 'object' && newKey !== null) {
                if (typeof newObject[key] !== 'object' || newObject[key] === null) {
                    continue;
                }
                if (Array.isArray(newObject[key])) {
                    newObject[key] = arrayDataMapper(newObject[key], newKey);
                } else {
                    newObject[key] = dataMapper(newObject[key], newKey);
                }
            } else {
                newObject[newKey] = newObject[key];
                delete newObject[key];
            }
        }
    }

    return newObject;
};

/**
 * @function cloneObject
 * @description Возвращает глубокую копию объекта
 * @param {Object|*[]} object - Объект для копирования
 * @returns {any} - Скопированный объект
 */
export const cloneObject = object => JSON.parse(JSON.stringify(object));

/**
 * @function getObjectWithoutEmptyFields
 * @description Возвращает новый объект, в котором удалены все пустые свойства переданного (``undefined``, ``null``, ``''``, ``[]``)
 * @param {Object} _object - Объект для обработки
 * @returns {Object} - Объект без пустых свойств
 *
 * @example
 * const query = { price: null, value: 10, items: [] };
 * const cleanQuery = getObjectWithoutEmptyFields(query);
 * // cleanQuery = { value: 10 }
 */
export const getObjectWithoutEmptyFields = _object => {
    const object = cloneObject(_object);

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && !value.length)
            ) {
                delete object[key];
            }
        }
    }

    return object;
};

export const optionsToList = options => {
    return Object.keys(options).map(key => ({ value: Number(key), label: options[key] }));
};

export const assignQueryToForm = (query, formObject) => {
    Object.keys(query).forEach(key => {
        if (key in formObject) {
            if (Array.isArray(formObject[key]) && !Array.isArray(query[key]))
                formObject[key] = [query[key]];
            else if (Array.isArray(query[key]) && !Array.isArray(formObject[key])) {
                formObject[key] = query[key][query[key].length - 1];
            } else formObject[key] = query[key];
        }
    });
};

/**
 * Выборка только нужных свойств перед отправкой запроса
 *
 * @param {object} form - форма
 * @param {array} template - список свойств
 * @returns {object}
 */
export function formToPayload(form, template) {
    return template.reduce((acc, key) => {
        if (form[key] !== undefined) acc[key] = form[key];

        return acc;
    }, {});
}
