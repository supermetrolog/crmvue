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
    // async getOptimizeRoutes(coords) {
    //     await this.init();
    //     let data = [];
    //     coords.map((coord, i) => {
    //         data[coord.original_id] = [];
    //         coords.map((coordDuplicate, j) => {
    //             if (i != j) {
    //                 data[coord.original_id].push({
    //                     betweenCoord: [coord.original_id, coordDuplicate.original_id],
    //                     distance: window.ymaps.formatter.distance(
    //                         window.ymaps.coordSystem.geo.getDistance(coord.coord, coordDuplicate.coord)
    //                     )
    //                 });
    //             }
    //         })
    //     });
    // },
};

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
    normalizeDataForForm(data) {
        let array = [];
        let newData = {
            ...data
        };

        newData.directions.map(item => {
            array.push(item.direction)
        });
        newData.directions = array;
        array = [];

        newData.districts.map(item => {
            array.push(item.district)
        });
        newData.districts = array;
        array = [];

        newData.gateTypes.map(item => {
            array.push(item.gate_type)
        });
        newData.gateTypes = array;
        array = [];

        newData.objectClasses.map(item => {
            array.push(item.object_class)
        });
        newData.objectClasses = array;
        array = [];

        newData.objectTypes.map(item => {
            array.push(item.object_type)
        });
        newData.objectTypes = array;
        array = [];

        newData.regions.map(item => {
            array.push(item.region)
        });
        newData.regions = array;
        array = [];
        return newData;
    },
    normalizeDataForContactForm(data) {
        let array = [];
        let newData = {
            ...data
        };

        newData.emails.map(item => {
            array.push(item.email)
        });
        if (!array.length) {
            array.push("");
        }
        newData.emails = array;
        array = [];
        newData.phones.map(item => {
            array.push(item.phone)
        });
        if (!array.length) {
            array.push("");
        }
        newData.phones = array;
        array = [];
        newData.websites.map(item => {
            array.push(item.website)
        });
        if (!array.length) {
            array.push("");
        }
        newData.websites = array;
        array = [];
        newData.wayOfInformings.map(item => {
            array.push(item.way)
        });
        newData.wayOfInformings = array;
        array = [];
        return newData;

    },
    normalizeDataForCompanyForm(data) {
        let array = [];
        let newData = data;
        newData.productRanges.map(item => {
            array.push(item.product)
        });
        newData.productRanges = array;
        array = [];

        newData.categories.map(item => {
            array.push(item.category)
        });
        newData.categories = array;
        array = [];

        if (!newData.contacts.length) {
            newData.contacts = { phones: [""], emails: [""], websites: [""] };
            return newData;
        }
        newData.contacts = newData.contacts.find(item => item.type == 1);
        console.error(newData.contacts);

        if (!newData.contacts) {
            newData.contacts = { phones: [""], emails: [""], websites: [""] };
            return newData;
        }

        newData.contacts.emails.map(item => {
            array.push(item.email)
        });
        if (!array.length) {
            array.push("");
        }
        newData.contacts.emails = array;
        array = [];
        newData.contacts.phones.map(item => {
            array.push(item.phone)
        });
        if (!array.length) {
            array.push("");
        }
        newData.contacts.phones = array;
        array = [];
        newData.contacts.websites.map(item => {
            array.push(item.website)
        });
        if (!array.length) {
            array.push("");
        }
        newData.contacts.websites = array;
        array = [];
        return newData;
    },
}