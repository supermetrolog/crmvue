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
                label: contact.type ? 'Общий контакт' : contact.full_name,
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
                label: contact.type ? 'Общий контакт' : contact.full_name,
                options: array
            });
        });
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
