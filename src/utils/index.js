import { loadYmap } from 'vue-yandex-maps';
import { alg } from '@/utils/alg';
import sha256 from 'crypto-js/sha256';

export const yandexmap = {
    settings: {
        apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1'
    },
    async init() {
        await loadYmap({ ...this.settings, debug: true });
    },
    getObjectsCoords(objects, userLocation) {
        let coords = [];
        coords.push({ original_id: -1, coord: userLocation });
        objects.forEach(object => {
            let tempObj;
            if (object.offer) {
                tempObj = object.offer;
            } else {
                tempObj = object;
            }
            coords.push({
                original_id: tempObj.original_id,
                coord: [+tempObj.latitude, +tempObj.longitude]
            });
        });
        return coords;
    },
    getDistances(coords) {
        let distances = [];

        function getMinDistances(coords, idx = -1, i = coords.length - 2) {
            if (i < 0) {
                return;
            }

            const startPoint = coords.find(item => item.original_id === idx);
            coords = coords.filter(coord => coord.original_id !== startPoint.original_id);
            i--;

            let routes = [];
            coords.forEach(coordDuplicate => {
                routes.push({
                    id: coordDuplicate.original_id,
                    distance: parseInt(
                        window.ymaps.coordSystem.geo.getDistance(
                            startPoint.coord,
                            coordDuplicate.coord
                        )
                    )
                });
            });

            distances.push({ id: startPoint.original_id, routes: routes });

            let nextPoint = routes.sort((a, b) => a.distance - b.distance)[0];
            if (nextPoint) {
                getMinDistances(coords, nextPoint.id, i);
            }
        }

        getMinDistances(coords, -1);
        return distances;
    },
    getMinimumDistance(distances) {
        let resultArray = [];
        distances.forEach(item => resultArray.push(item.routes[0]));
        return resultArray;
    },
    async getOptimizeRoutes(objects, userLocation) {
        const coords = await this.getObjectsCoords(objects, userLocation);
        await this.init();
        const distances = await this.getDistances(coords);
        const minDistance = await this.getMinimumDistance(distances);
        return [...minDistance.map(item => item.id)];
    },

    async findAddress(query) {
        // Геокодируем введённые данные.
        if (!query || !window.ymaps || !window.ymaps.geocode) {
            return [];
        }
        query = 'россия ' + query;
        let result = [];
        await window.ymaps.geocode(query).then(function (res) {
            let obj = res.geoObjects;
            obj.each(item => {
                result.push(item.getAddressLine());
            });
        });
        return result;
    },
    async findCoordinates(query) {
        if (!query || !window.ymaps || !window.ymaps.geocode) {
            return [];
        }
        query = 'россия ' + query;
        let result = await window.ymaps.geocode(query).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates(),
                result = coords;
            return result;
        });
        return result;
    },
    async getAddress(query, currentAddress = null) {
        await this.init();
        let address = await this.findAddress(query);
        if (currentAddress) {
            address.push(currentAddress);
        }
        return address;
    }
};
export const waitHash = data => {
    return sha256(JSON.stringify(data)).toString();
};

export const contains = (target, pattern = []) => {
    let exist = false;
    pattern.forEach(word => {
        if (!exist) exist = !!target.includes(word);
    });
    return exist;
};

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
    normalizeDataForRequestForm(data) {
        let array = [];

        data.directions.map(item => {
            array.push(item.direction);
        });
        data.directions = array;

        array = [];
        data.districts.map(item => {
            array.push(item.district);
        });
        data.districts = array;

        array = [];
        data.gateTypes.map(item => {
            array.push(item.gate_type);
        });
        data.gateTypes = array;

        array = [];
        data.objectClasses.map(item => {
            array.push(item.object_class);
        });
        data.objectClasses = array;

        array = [];
        data.objectTypes.map(item => {
            array.push(item.object_type);
        });
        data.objectTypes = array;

        array = [];
        data.regions.map(item => {
            array.push(item.region);
        });
        data.regions = array;

        array = [];
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

export const cloneObject = object => JSON.parse(JSON.stringify(object));

export const getObjectWithoutEmptyFields = _object => {
    const object = cloneObject(_object);

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (value === null || value === '' || (Array.isArray(value) && !value.length)) {
                delete object[key];
            }
        }
    }

    return object;
};

export const optionsToList = options => {
    return Object.keys(options).map(key => ({ value: Number(key), label: options[key] }));
};

export const multiselectAdapter = (options, value, label) => {
    if (typeof label === 'string')
        return options.map(item => ({ value: item[value], label: item[label] }));
    else if (typeof label === 'function') {
        return options.map(item => ({ value: item[value], label: label(item) }));
    }
};

export const multiselectAdapterToObject = (options, value, label) => {
    if (typeof label === 'string')
        return options.reduce((arr, item) => {
            arr[item[value]] = item[label];
            return arr;
        }, {});
    else if (typeof label === 'function') {
        return options.reduce((arr, item) => {
            arr[item[value]] = label(item);
            return arr;
        }, {});
    }
};

export const deleteEmptyFields = object => {
    const deletedFields = [];

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (value === null || value === '' || (Array.isArray(value) && !value.length)) {
                delete object[key];
                deletedFields.push(key);
            }
        }
    }

    return deletedFields;
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

export const reducer = {
    sum: (element, fields = null) => {
        if (fields === null) return element.reduce((acc, el) => acc + el, 0);
        if (fields instanceof Array)
            return element.reduce(
                (acc, el) => acc + fields.reduce((_acc, field) => _acc + el[field] ?? 0, 0),
                0
            );

        return element.reduce((acc, el) => acc + el[fields], 0);
    },
    min: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return Math.min(...element);

        return element.reduce((acc, el) => Math.min(acc, el[field]), element[0][field]);
    },
    max: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return Math.max(...element);

        return element.reduce((acc, el) => Math.max(acc, el[field]), element[0][field]);
    },
    strictMin: (element, field = null) => {
        if (!element.length) return null;
        if (field === null) return alg.strictMin(...element);
        if (field instanceof Array) {
            const defaultMinValue = reducer.strictMin(field.map(_field => element[0][_field]));

            return element.reduce(
                (acc, el) => alg.strictMin(acc, ...field.map(_field => el[_field])),
                defaultMinValue
            );
        }

        return element.reduce((acc, el) => alg.strictMin(acc, el[field]), element[0][field]);
    }
};
