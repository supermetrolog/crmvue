import {loadYmap} from "vue-yandex-maps";
import crypto from 'crypto-browserify'

export const yandexmap = {
    settings: {
        apiKey: "59572809-066b-46d5-9e5d-269a65751b84",
        lang: "ru_RU",
        coordorder: "latlong",
        enterprise: false,
        version: "2.1",
    },
    async init() {
        await loadYmap({...this.settings, debug: true});
    },
    getObjectsCoords(objects, userLocation) {
        let coords = [];
        coords.push({original_id: -1, coord: userLocation});
        objects.forEach((object) => {
            let tempObj;
            if (object.offer) {
                tempObj = object.offer;
            } else {
                tempObj = object;
            }
            coords.push({
                original_id: tempObj.original_id,
                coord: [+tempObj.latitude, +tempObj.longitude],
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

            const startPoint = coords.find((item) => item.original_id === idx);
            coords = coords.filter(
                (coord) => coord.original_id !== startPoint.original_id
            );
            i--;

            let routes = [];
            coords.forEach((coordDuplicate) => {
                routes.push({
                    id: coordDuplicate.original_id,
                    distance: parseInt(
                        window.ymaps.coordSystem.geo.getDistance(
                            startPoint.coord,
                            coordDuplicate.coord
                        )
                    ),
                });
            });

            distances.push({id: startPoint.original_id, routes: routes});

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
        distances.forEach((item) => resultArray.push(item.routes[0]));
        return resultArray;
    },
    async getOptimizeRoutes(objects, userLocation) {
        const coords = await this.getObjectsCoords(objects, userLocation);
        await this.init();
        const distances = await this.getDistances(coords);
        const minDistance = await this.getMinimumDistance(distances);
        return [...minDistance.map((item) => item.id)];
    },

    async findAddress(query) {
        // Геокодируем введённые данные.
        if (!query || !window.ymaps || !window.ymaps.geocode) {
            return [];
        }
        query = "россия " + query;
        let result = [];
        await window.ymaps.geocode(query).then(
            function (res) {
                let obj = res.geoObjects;
                obj.each((item) => {
                    result.push(item.getAddressLine());
                });
            }
        );
        return result;
    },
    async findCoordinates(query) {
        if (!query || !window.ymaps || !window.ymaps.geocode) {
            return [];
        }
        query = "россия " + query;
        let result = await window.ymaps.geocode(query).then(
            function (res) {
                var firstGeoObject = res.geoObjects.get(0),
                    coords = firstGeoObject.geometry.getCoordinates(),
                    result = coords;
                return result;
            }
        );
        return result;
    },
    async getAddress(query, currentAddress = null) {
        await this.init();
        let address = await this.findAddress(query);
        if (currentAddress) {
            address.push(currentAddress);
        }
        return address;
    },
};
export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
export const validatePropogationInput = (fields, name) => {
    let flag = true;
    fields.forEach((item, index) => {
        if (index > 0 && !item[name].length) {
            flag = false;
        }
    });
    return flag;
};
export const validateUrl = (str) => {
    const with_protocol_regex = new RegExp(
        "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );

    const regex = new RegExp(
        "^([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );
    if (!regex.test(str) && !with_protocol_regex.test(str)) {
        return false;
    }
    return true;
};

export const waitHash = (data) => {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("base64");
};

export const contains = (target, pattern = []) => {
    let exist = false;
    pattern.forEach((word) => {
        if (!exist) exist = !!target.includes(word);
    });
    return exist;
};

export default {
    normalizeContactsForMultiselect(contacts) {
        let data = [];
        contacts.map((contact) => {
            let array = [];

            contact.phones.map((item) => {
                array.push({
                    label: item.phone,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 0,
                        value: item.phone,
                    },
                });
            });
            contact.emails.map((item) => {
                array.push({
                    label: item.email,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 1,
                        value: item.email,
                    },
                });
            });
            data.push({
                label: contact.type ? "Общий контакт" : contact.first_and_last_name,
                options: array,
            });
        });
        return data;
    },
    normalizeContactsForMultiselectOnlyEmails(contacts) {
        let data = [];
        contacts.map((contact) => {
            let array = [];

            contact.emails.map((item) => {
                array.push({
                    label: item.email,
                    value: {
                        contact_id: item.contact_id,
                        id: item.id,
                        type: 1,
                        value: item.email,
                    },
                });
            });
            if (!array.length) return;
            data.push({
                label: contact.type ? "Общий контакт" : contact.first_and_last_name,
                options: array,
            });
        });
        return data;
    },
    normalizeDataForRequestForm(data) {
        let array = [];

        data.directions.map((item) => {
            array.push(item.direction);
        });
        data.directions = array;

        array = [];
        data.districts.map((item) => {
            array.push(item.district);
        });
        data.districts = array;

        array = [];
        data.gateTypes.map((item) => {
            array.push(item.gate_type);
        });
        data.gateTypes = array;

        array = [];
        data.objectClasses.map((item) => {
            array.push(item.object_class);
        });
        data.objectClasses = array;

        array = [];
        data.objectTypes.map((item) => {
            array.push(item.object_type);
        });
        data.objectTypes = array;

        array = [];
        data.regions.map((item) => {
            array.push(item.region);
        });
        data.regions = array;

        array = [];
        return data;
    },
    normalizeDataForCompanyForm(data) {
        data.contacts = data.contacts.find((item) => item.type == 1);
        if (!data.contacts) {
            data.contacts = {
                emails: [],
                phones: [],
                websites: [],
            };
            return data;
        }
        return data;
    },
    normalizeDataForUserForm(data) {
        delete data.password;
        delete data.created_at;
        return data;
    },
};

export const arrayDataMapper = (array, rules) => {
    const newArray = [];
    for (const key in array) {
        const object = array[key];
        if (typeof object !== "object" || object === null) {
            throw "element must be Object";
        }
        newArray.push(dataMapper(object, rules));
    }
    return newArray;
};
export const dataMapper = (object, rules) => {
    const newObject = {...object};

    for (const key in rules) {
        if (
            Object.hasOwnProperty.call(rules, key) &&
            Object.hasOwnProperty.call(newObject, key)
        ) {
            const newKey = rules[key];
            if (typeof newKey === "object" && newKey !== null) {
                if (typeof newObject[key] !== "object" || newObject[key] === null) {
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
