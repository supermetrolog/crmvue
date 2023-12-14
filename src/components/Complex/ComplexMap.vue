<template>
    <div class="ComplexMap">
        <div class="ComplexMap-description" :class="{ disabled: mapIsOpened }">
            <div class="ComplexMap-description-item" v-if="location.regionRecord">
                {{ ucFirst(location.regionRecord.title) }}
            </div>
            <div class="ComplexMap-description-item" v-if="location.districtTypeRecord">
                {{ ucFirst(location.districtTypeRecord.title) }} {{ ucFirst(location.districtRecord.title) }}
            </div>
            <div class="ComplexMap-description-item" v-if="location.directionRecord">
                {{ ucFirst(location.directionRecord.title) }}
            </div>
            <div class="ComplexMap-description-item" v-if="location.townRecord">
                {{ ucFirst(location.townRecord.townTypeRecord.title) }} {{ ucFirst(location.townRecord.title) }}
            </div>
            <div class="ComplexMap-description-item" v-if="location.highwayRecord">
                {{ ucFirst(location.highwayRecord.title) }} шоссе
            </div>
            <div
                class="ComplexMap-description-item"
                v-if="location.metroRecord"
                :title="location.metroRecord.title"
            >
                <div>
                    <img :src="require(`@/assets/image/metro.png`)" alt="метро"/>
                </div>
                <span>{{ ucFirst(location.metroRecord.title, true) }}</span>
            </div>
            <div class="ComplexMap-description-item" v-if="location.fromMkad">
                {{ location.fromMkad }} км от МКАД
            </div>
            <div class="ComplexMap-description-actions">
                <button class="ComplexMap-description-actions-item" title="Add new">
                    <i class="fas fa-plus-circle"/>
                </button>
            </div>
        </div>
        <div class="ComplexMap-control">
            <div class="ComplexMap-button" title="Open map" @click="openMap">
                <i class="fas fa-map-marker-alt" :class="{ active: mapIsOpened }"></i>
            </div>
        </div>
        <YandexMapView
            :settings="map.settings"
            :styles="map.styles"
            :detailedControls="map.detailedControls"
            :behaviors="map.behaviors"
            :coords="complexCoords"
            :key="randKey"
        />
    </div>
</template>

<script>
import YandexMapView from "@/components/YandexMap/YandexMapView.vue";

export default {
    name: "ComplexMap",
    components: {YandexMapView},
    props: {
        location: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            ucFirst: this.$formatter.text().ucFirst,
            map: {
                settings: {
                    height: "70px",
                },
                styles: {
                    height: '75px',
                    width: '100%'
                },
                detailedControls: {
                    zoomControl: {
                        position: {
                            right: "10px",
                            top: "110px",
                        },
                        visible: false,
                    },
                    geolocationControl: {
                        position: {
                            top: "70px",
                            left: "10px",
                        },
                        visible: false,
                    },
                    trafficControl: {
                        position: {
                            top: "70px",
                            right: "140px",
                        },
                        visible: false,
                    },
                    typeSelector: {
                        position: {
                            top: "70px",
                            right: "45px",
                        },
                        visible: false,
                    },
                    searchControl: {
                        position: {
                            top: "70px",
                            left: "45px",
                        },
                        visible: false,
                    },
                    fullscreenControl: {
                        position: {
                            top: "70px",
                            right: "10px",
                        },
                        visible: false,
                    },
                    rulerControl: {
                        visible: false,
                    },
                },
                behaviors: [],
            },
            mapIsOpened: false,
            randKey: 0,
            isAdmin: true
        };
    },
    computed: {
        complexCoords() {
            const {latitude, longitude} = this.location;
            return latitude && longitude
                ? [latitude, longitude]
                : [55.75554289958026, 37.619346417968764];
        }
    },
    methods: {
        openMap() {
            if (this.mapIsOpened) {
                this.mapIsOpened = false;
                this.map.styles.height = "70px";
                this.randKey = Math.round(Math.random() * 1000);
                for (const [key, value] of Object.entries(this.map.detailedControls)) {
                    this.map.detailedControls[key] = {...value, visible: false};
                }
                this.map.behaviors = [];
            } else {
                this.mapIsOpened = true;
                this.map.styles.height = "500px";
                this.randKey = Math.round(Math.random() * 1000);
                for (const [key, value] of Object.entries(this.map.detailedControls)) {
                    this.map.detailedControls[key] = {...value, visible: true};
                }
                this.map.behaviors = ["drag", "multiTouch", "scrollZoom"];
            }
        },
    }
};
</script>
