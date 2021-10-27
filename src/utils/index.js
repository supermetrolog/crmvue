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
    async getOptimizeRoutes(coords) {
        await this.init();
        let data = [];
        coords.map((coord, i) => {
            data[coord.original_id] = [];
            coords.map((coordDuplicate, j) => {
                if (i != j) {
                    data[coord.original_id].push({
                        betweenCoord: [coord.original_id, coordDuplicate.original_id],
                        distance: window.ymaps.formatter.distance(
                            window.ymaps.coordSystem.geo.getDistance(coord.coord, coordDuplicate.coord)
                        )
                    });
                }
            })
        });
    },
};

export default {
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