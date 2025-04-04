<template>
    <div class="ymap">
        <div class="d-flex gap-2 flex-wrap mb-2">
            <DashboardChip class="dashboard-bg-success-l">
                Расстояние: {{ route.length }}
            </DashboardChip>
            <DashboardChip class="dashboard-bg-success-l">
                Время в пути: {{ route.time }}
            </DashboardChip>
        </div>
        <yandex-map
            v-if="mounted"
            :key="render"
            ref="map"
            :settings="settings"
            :options="options.mapOptions"
            :coords="options.coords"
            :zoom="options.zoom"
            :controls="options.controls"
            :detailed-controls="options.detailedControls"
            style="width: 100%; height: 400px"
        />
    </div>
</template>

<script>
import { loadYmap, yandexMap } from 'vue-yandex-maps';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Ymap',
    components: { DashboardChip, yandexMap },
    props: {
        manualRoute: {
            type: Array,
            default: () => []
        },
        userLocation: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            render: 0,
            mounted: false,
            route: {
                done: false,
                userLocation: this.userLocation,
                length: null,
                time: null,
                warning: null
            },
            settings: {
                apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
                lang: 'ru_RU',
                coordorder: 'latlong',
                enterprise: false,
                version: '2.1'
            },
            options: {
                mapOptions: {
                    suppressObsoleteBrowserNotifier: true,
                    suppressMapOpenBlock: true
                },
                coords: [55.75554289958026, 37.619346417968764],
                zoom: 7,
                controls: ['trafficControl', 'zoomControl'],
                detailedControls: {
                    zoomControl: {
                        position: {
                            right: '10px',
                            top: '100px'
                        }
                    }
                }
            }
        };
    },
    computed: {
        dataForRoute() {
            const data = {
                coords: []
            };
            data.coords.push(this.route.userLocation);

            this.manualRoute.map(object => {
                data.coords.push([object.offer.latitude, object.offer.longitude]);
            });
            //   coords.push(this.route.userLocation);

            return data;
        }
    },
    watch: {
        manualRoute: {
            handler() {
                if (this.mounted) {
                    this.runBuildRoute();
                }
            },
            deep: true
        },
        userLocation(newValue) {
            this.route.userLocation = newValue;
            this.runBuildRoute();
        }
    },
    methods: {
        runBuildRoute() {
            this.reRender();
            if (this.mounted) {
                setTimeout(() => {
                    this.buildRoute();
                }, 500);
            }
        },
        clearMyMap(map) {
            if (map.geoObjects) {
                map.geoObjects.each(object => {
                    map.geoObjects.remove(object);
                });
            }
        },
        buildRoute() {
            if (!this.$refs.map) return;

            const myMap = this.$refs.map.$options.static.myMap;
            this.clearMyMap(myMap);
            var multiRoute = new window.ymaps.multiRouter.MultiRoute(
                {
                    referencePoints: this.dataForRoute.coords,
                    params: {
                        avoidTrafficJams: true
                        // viaIndexes: [2],
                        // routingMode: "masstransit",
                    }
                },
                {
                    boundsAutoApply: true,
                    wayPointStartIconColor: '#FFFFFF',
                    wayPointStartIconFillColor: 'teal',

                    wayPointFinishIconColor: '#FFFFFF',
                    wayPointFinishIconFillColor: '#f93154'
                }
            );
            this.setRouteData(multiRoute);
            this.customizePoints(multiRoute);
            myMap.geoObjects.add(multiRoute);
        },
        setRouteData(multiRoute) {
            multiRoute.model.events.add('requestsuccess', () => {
                var activeRoute = multiRoute.getActiveRoute();
                this.route.done = false;
                this.route.length = activeRoute.properties.get('distance').text;
                this.route.time = activeRoute.properties.get('duration').text;
                if (activeRoute.properties.get('blocked')) {
                    this.route.warning = 'На маршруте имеются участки с перекрытыми дорогами.';
                }
            });
        },
        customizePoints(multiRoute) {
            multiRoute.model.events.once('requestsuccess', () => {
                let index = 0;
                let wayPoint = null;
                while ((wayPoint = multiRoute.getWayPoints().get(index))) {
                    if (index == 0) {
                        index++;
                        continue;
                    }
                    wayPoint.options.set({
                        preset: 'cluster#balloonTwoColumns',
                        iconContentLayout: window.ymaps.templateLayoutFactory.createClass(
                            `<div style="width: 100%; height: 100%" title="${
                                this.manualRoute[index - 1].offer.object_type_name +
                                '\n' +
                                this.manualRoute[index - 1].offer.address
                            }">
              <span style="color: red; text-transform: uppercase;">${
                  this.manualRoute[index - 1].offer.visual_id
              }</span></div>`
                        )
                        //         balloonContentLayout: window.ymaps.templateLayoutFactory
                        //           .createClass(`<div v-html="properties.balloonContentHeader"></div>
                        // <div v-html="properties.balloonContentBody"></div>
                        // <div v-html="properties.balloonContentFooter"></div>`),
                    });
                    index++;
                }
            });
        },
        reRender() {
            this.render++;
        }
    },
    async mounted() {
        await loadYmap({ ...this.settings, debug: false });
        this.mounted = true;
        this.runBuildRoute();
    }
};
</script>

<style></style>
