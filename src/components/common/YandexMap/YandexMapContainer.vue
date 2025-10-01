<template>
    <div class="ymap">
        <yandex-map
            v-if="loaded"
            ref="map"
            :settings="settings"
            :coords="coords"
            :zoom="zoom"
            :controls="hideControls ? [] : controls"
            :detailed-controls="hideControls ? [] : detailedControls"
            :behaviors="hideControls ? [] : behaviors.filter(elem => elem !== 'selection')"
            :style="styles"
            :options="options"
        >
            <YandexMapSelectionBehavior
                v-if="!hideControls && behaviors.includes('selection')"
                @selectionDone="selectionDone"
                @removedDone="$emit('removedDone')"
                :map="$refs.map.$options.static.myMap"
                :options="polygonOptions"
                :coordinates="polygonCoordinates"
            />
            <slot />
        </yandex-map>
        <div v-else class="skeleton h-100 w-100 op-5"></div>
    </div>
</template>

<script>
import { loadYmap, yandexMap } from 'vue-yandex-maps';
import YandexMapSelectionBehavior from '@/components/common/YandexMap/YandexMapSelectionBehavior.vue';

export default {
    name: 'YandexMapContainer',
    components: {
        YandexMapSelectionBehavior,
        yandexMap
    },
    emits: ['mounted', 'cluster-click', 'selectionDone', 'object-click', 'updated', 'removedDone'],
    provide() {
        return {
            add: this.addMarker,
            remove: this.removeMarker
        };
    },
    props: {
        settings: {
            type: Object,
            default: () => ({})
        },
        coords: {
            type: Array,
            default: () => [55.75554289958026, 37.619346417968764] // moscow center
        },
        hideControls: Boolean,
        zoom: {
            type: Number,
            default: 8
        },
        options: {
            type: Object,
            default: () => {
                return {
                    suppressObsoleteBrowserNotifier: true,
                    suppressMapOpenBlock: true
                };
            }
        },
        controls: {
            type: Array,
            default: () => ['default']
        },
        detailedControls: {
            type: Object,
            default: () => {
                return {
                    zoomControl: {
                        position: {
                            right: '10px',
                            top: '100px'
                        }
                    },
                    geolocationControl: {
                        float: 'right'
                    },
                    searchControl: {
                        float: 'right'
                    },
                    typeSelector: {
                        size: 'large'
                    }
                };
            }
        },
        behaviors: {
            type: Array,
            default: () => ['drag', 'multiTouch', 'selection']
        },
        clusterOptions: {
            type: Object,
            default: () => {
                return {
                    gridSize: 32,
                    hasHint: true,
                    hasBalloon: true,
                    margin: 5,
                    iconLayout: {},
                    minClusterSize: 4,
                    preset: 'islands#invertedVioletClusterIcons',
                    groupByCoordinates: false,
                    useMapMargin: true,
                    zoomMargin: null,
                    viewportMargin: null,
                    clusterDisableClickZoom: false,
                    clusterOpenBalloonOnClick: true,
                    clusterBalloonContentLayout: 'cluster#balloonAccordion',
                    clusterBalloonPanelMaxMapArea: 0,
                    clusterBalloonContentLayoutHeight: 400,
                    clusterBalloonContentLayoutWidth: 400,
                    clusterBalloonAccordionShowIcons: false
                };
            }
        },
        gridSize: {
            type: Number,
            default: 32
        },
        useObjectManager: {
            type: Boolean,
            default: false
        },
        objectManagerClusterize: {
            type: Boolean,
            default: false
        },
        polygonOptions: {
            type: Object,
            default: () => {
                return {
                    strokeColor: '#1679e7',
                    fillColor: '#a2c9d8',
                    interactivityModel: 'default#transparent',
                    strokeWidth: 4,
                    opacity: 0.7,
                    accuracy: 3,
                    polygonZoom: 10,
                    polygonZoomDuration: 100
                };
            }
        },
        polygonCoordinates: {
            type: Array,
            default: () => []
        },
        styles: {
            type: Object,
            default: () => {
                return {
                    width: '100%',
                    height: '100%'
                };
            }
        }
    },
    data() {
        return {
            updateTimeout: null,
            loaded: false,
            addMarkers: [],
            removeMarkers: [],
            markers: []
        };
    },
    static: {
        objectManager: null
    },
    methods: {
        destroyMap() {
            this.getMap().destroy();
            this.$options.static.objectManager = null;
        },
        selectionDone(coordinates) {
            this.$emit('selectionDone', coordinates);
        },
        getMap() {
            return this.$refs.map ? this.$refs.map.$options.static.myMap : null;
        },
        getObjectManager() {
            let objectManager = this.$options.static.objectManager;

            if (!objectManager) {
                objectManager = new window.ymaps.ObjectManager({
                    clusterize: true,
                    ...this.clusterOptions,
                    gridSize: this.gridSize
                });

                objectManager.objects.events.add(['click'], this.objectEventHandler);
                objectManager.clusters.events.add(['click'], this.clusterEventHandler);
            }

            return objectManager;
        },
        //emit objectClick
        objectEventHandler(event) {
            this.$emit(
                'object-' + event.get('type'),
                event.get('objectId'),
                this.getObjectManager()
            );
        },

        //emit clusterClick
        clusterEventHandler(event) {
            this.$emit(
                'cluster-' + event.get('type'),
                event.get('objectId'),
                this.getObjectManager(),
                event.originalEvent
            );
        },

        addMarkersToObjectManager(markers) {
            const objectManager = this.getObjectManager();
            objectManager.add(markers);
            this.addObjectManagerToMap(objectManager);
        },
        addObjectManagerToMap(objectManager) {
            const map = this.getMap();

            if (this.$options.static.objectManager == null) {
                map.geoObjects.add(objectManager);
            }

            this.$options.static.objectManager = objectManager;
        },
        triggerUpdated() {
            this.$emit('updated');
        },
        addMarker(marker) {
            if (this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }
            this.addMarkers.push(marker);
            this.updateTimeout = setTimeout(this.update, 100);
        },
        removeMarker(marker) {
            if (this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }
            this.removeMarkers.push(marker.id);
            this.updateTimeout = setTimeout(this.update, 100);
        },
        removeObjectManager() {
            const objectManager = this.$options.static.objectManager;
            if (objectManager) {
                this.getMap().geoObjects.remove(objectManager);
                this.$options.static.objectManager = null;
            }
        },
        update() {
            if (!this.getMap()) return false;
            this.removeObjectManager();

            this.markers = this.markers.filter(marker => !this.removeMarkers.includes(marker.id));

            this.markers.push(...this.addMarkers);

            this.addMarkersToObjectManager(this.markers);

            this.removeMarkers = [];
            this.addMarkers = [];
            this.triggerUpdated();
        },
        setCenter(coords, zoom, options = {}) {
            this.getMap().setCenter(coords, zoom, options);
        },
        getZoom() {
            return Number(this.getMap().getZoom() ?? 0);
        },
        increaseZoom() {
            this.setZoom(this.getZoom() + 1, { duration: 500 });
        },
        decreaseZoom() {
            this.setZoom(this.getZoom() - 1, { duration: 500 });
        },
        setZoom(value, options = {}) {
            const map = this.getMap();

            if (!map) {
                return;
            }

            map.setZoom(value, { checkZoomRange: true, ...options });
        }
    },
    async mounted() {
        await loadYmap({
            apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
            lang: 'ru_RU',
            coordorder: 'latlong',
            enterprise: false,
            version: '2.1',
            ...this.settings
        });

        this.loaded = true;

        this.$emit('mounted');
    },
    beforeUnmount() {
        this.destroyMap();
    }
};
</script>

<style></style>
