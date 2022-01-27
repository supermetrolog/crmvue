import { loadYmap } from 'vue-yandex-maps'
export const yandexmap = {
    settings: {
        apiKey: '59572809-066b-46d5-9e5d-269a65751b84',
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1'
    },
    async init() {
        await loadYmap({...this.settings, debug: true });
    },
    getObjectsCoords(objects, userLocation) {
        let coords = [];
        coords.push({ original_id: -1, coord: userLocation });
        objects.map((object) => {
            coords.push({
                original_id: object.original_id,
                coord: [+object.latitude, +object.longitude],
            });
        });
        return coords;
    },
    getDistances(coords) {
        let distances = [];
        coords.map((coord, i) => {
            distances[coord.original_id] = [];
            coords.map((coordDuplicate, j) => {
                if (i != j) {
                    distances[coord.original_id][coordDuplicate.original_id] = parseInt(window.ymaps.coordSystem.geo.getDistance(coord.coord, coordDuplicate.coord) / 1000);
                    // distances[coord.original_id].push({
                    //     betweenCoord: coordDuplicate.original_id,
                    //     distance: parseInt(window.ymaps.coordSystem.geo.getDistance(coord.coord, coordDuplicate.coord) / 1000)
                    // });
                }
            })
        });
        return distances;
    },
    getMinimumDistance(distances, idx = -1, i = 4, count = 0) {
        if (i < 0) {
            return distances;

        }
        const startPoint = distances[idx];
        startPoint.map((distance, index) => {
            count += distance;
            i--;
            this.getMinimumDistance(distances, index, i, count);
        });
        console.warn(startPoint, idx, 4, count);
        // this.getMinimumDistance(startPoint, index, i);
        // distances.map((item, index) => {
        //     console.warn(item, index);
        // });
        return distances;

    },
    async getOptimizeRoutes(objects, userLocation) {
        const coords = await this.getObjectsCoords(objects, userLocation);

        await this.init();
        const distances = await this.getDistances(coords);
        const minDistance = await this.getMinimumDistance(distances);
        return minDistance;
    },
    async findAddress(query) {
        // Геокодируем введённые данные.
        if (!query) {
            return [];
        }
        query = 'россия ' + query;
        let result = [];
        await window.ymaps.geocode(query).then(function(res) {
            let obj = res.geoObjects;
            obj.each((item) => {
                result.push(item.getAddressLine());
            });
        }, function(e) {
            console.error(e)
        })
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
}
export default {
    normalizeContactsForMultiselect(contacts) {
        let data = [];
        contacts.map((contact) => {
            data.push({
                value: -1,
                label: contact.type ? 'Общий контакт' : contact.first_name + ' ' + contact.last_name,
                disabled: true
            });
            contact.phones.map(item => {
                data.push({
                    value: item.phone,
                    label: item.phone
                });
            });
            contact.emails.map(item => {
                data.push({
                    value: item.email,
                    label: item.email
                });
            });
        });
        return data;
    },
    normalizeDataForRequestForm(data) {
        let array = [];

        data.directions.map(item => {
            array.push(item.direction)
        });
        data.directions = array;

        array = [];
        data.districts.map(item => {
            array.push(item.district)
        });
        data.districts = array;

        array = [];
        data.gateTypes.map(item => {
            array.push(item.gate_type)
        });
        data.gateTypes = array;

        array = [];
        data.objectClasses.map(item => {
            array.push(item.object_class)
        });
        data.objectClasses = array;

        array = [];
        data.objectTypes.map(item => {
            array.push(item.object_type)
        });
        data.objectTypes = array;

        array = [];
        data.regions.map(item => {
            array.push(item.region)
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
            }
            return data;
        }
        return data;
    },
    normalizeDataForUserForm(data) {
        delete data.password;
        delete data.created_at;
        delete data.email;
        return data;

    },
}