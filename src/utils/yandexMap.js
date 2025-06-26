import { loadYmap } from 'vue-yandex-maps';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

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
        return objects.reduce(
            (acc, object) => {
                const originalObject = isNotNullish(object.offer) ? object.offer : object;

                acc.push({
                    original_id: originalObject.original_id,
                    coord: [+originalObject.latitude, +originalObject.longitude]
                });

                return acc;
            },
            [{ original_id: -1, coord: userLocation }]
        );
    },
    getDistances(coords) {
        let distances = [];

        function getMinDistances(coords, idx = -1, i = coords.length - 2) {
            if (i < 0) return;

            const startPoint = coords.find(item => item.original_id === idx);
            coords = coords.filter(coord => coord.original_id !== startPoint.original_id);
            i--;

            const routes = coords.map(coord => ({
                id: coord.original_id,
                distance: parseInt(
                    window.ymaps.coordSystem.geo.getDistance(startPoint.coord, coord.coord)
                )
            }));

            distances.push({ id: startPoint.original_id, routes });

            const nextPoint = routes.sort((a, b) => a.distance - b.distance)[0];
            if (nextPoint) {
                getMinDistances(coords, nextPoint.id, i);
            }
        }

        getMinDistances(coords, -1);

        return distances;
    },
    getMinimumDistance(distances) {
        return distances.map(element => element.routes[0]);
    },
    async getOptimizeRoutes(objects, userLocation) {
        const coords = this.getObjectsCoords(objects, userLocation);

        await this.init();

        const distances = this.getDistances(coords);
        const minDistance = this.getMinimumDistance(distances);

        return [...minDistance.map(item => item.id)];
    },
    async findAddress(query) {
        if (!query || !window.ymaps || !window.ymaps.geocode) return [];

        try {
            const addresses = [];

            const preparedQuery = 'россия ' + query;

            const response = await window.ymaps.geocode(preparedQuery);

            const geoObjects = response.geoObjects;
            geoObjects.each(item => {
                addresses.push(item.getAddressLine());
            });

            return addresses;
        } catch (e) {
            return [];
        }
    },
    async findCoordinates(query) {
        if (!query || !window.ymaps || !window.ymaps.geocode) return [];

        const preparedQuery = 'россия ' + query;

        try {
            const response = await window.ymaps.geocode(preparedQuery);

            const geoObject = response.geoObjects.get(0);
            return geoObject.geometry.getCoordinates();
        } catch (e) {
            return [];
        }
    },
    async getAddress(query, currentAddress = null) {
        await this.init();

        const address = await this.findAddress(query);

        if (currentAddress) address.push(currentAddress);

        return address;
    }
};
