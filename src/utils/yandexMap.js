import { loadYmap } from 'vue-yandex-maps';

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
