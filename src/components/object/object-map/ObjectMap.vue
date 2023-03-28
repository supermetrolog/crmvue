<template>
    <div class="ObjectMap">
        <div class="ObjectMap-description" :class="{ 'disabled': mapIsOpened }">
            <div class="ObjectMap-description-item" v-if="region">{{ region }}</div>
            <div class="ObjectMap-description-item" v-if="district">{{ district }}</div>
            <div class="ObjectMap-description-item" v-if="districtMoscow">{{ districtMoscow }}</div>
            <div class="ObjectMap-description-item" v-if="direction">{{ direction }}</div>
            <div class="ObjectMap-description-item" v-if="town">{{ town }}</div>
            <div class="ObjectMap-description-item" v-if="highway">{{ highway }}</div>
            <div class="ObjectMap-description-item" v-if="highwayMoscow">{{ highwayMoscow }}</div>
            <div class="ObjectMap-description-item" :title="metro" v-if="metro">
                <div v-if="metroLogo">
                    <img :src="require(`../../../assets/image/${metroLogo}.png`)" alt="метро">
                </div>
                <span>{{ metro }}</span>
            </div>
            <div class="ObjectMap-description-item" v-if="fromMkad">{{ fromMkad }} км от МКАД</div>
        </div>
        <Ymap :settings="map.settings" :styles="map.styles" :detailedControls="map.detailedControls"
            :behaviors="map.behaviors" :coords="coords" :key="randKey" />
        <div class="ObjectMap-button">
            <i class="far fa-arrow-alt-circle-up" v-if="mapIsOpened" @click="openMap"></i>
            <i class="far fa-arrow-alt-circle-down" v-else @click="openMap"></i>
        </div>
    </div>
</template>

<script>
import Ymap from '../../common/ymap/Ymap.vue'
import './styles.scss'

export default {
    name: 'ObjectMap',
    components: { Ymap },
    props: {
        region: { type: String, default: null },
        district: { type: String, default: null },
        districtMoscow: { type: String, default: null },
        direction: { type: String, default: null },
        town: { type: String, default: null },
        highway: { type: String, default: null },
        highwayMoscow: { type: String, default: null },
        metro: { type: String, default: null },
        fromMkad: {
            type: [String, Number], default: null
        },
        coords: {
            type: Array,
            default: () => [55.75554289958026, 37.619346417968764], // moscow center
        },

    },
    data() {
        return {
            map: {
                settings: {
                    height: '100px'
                },
                styles: {
                    width: "100%",
                    height: "100px",
                },
                detailedControls: {
                    zoomControl: {
                        position: {
                            right: "10px",
                            top: "140px",
                        },
                        visible: false
                    },
                    geolocationControl: {
                        position: {
                            top: "100px",
                            left: "10px"
                        },
                        visible: false
                    },
                    trafficControl: {
                        position: {
                            top: "100px",
                            right: "140px"
                        },
                        visible: false
                    },
                    typeSelector: {
                        position: {
                            top: "100px",
                            right: "45px"
                        },
                        visible: false
                    },
                    searchControl: {
                        position: {
                            top: "100px",
                            left: '45px'
                        },
                        visible: false
                    },
                    fullscreenControl: {
                        position: {
                            top: '100px',
                            right: "10px"
                        },
                        visible: false
                    },
                    rulerControl: {
                        visible: false
                    }
                },
                behaviors: []

            },
            mapIsOpened: false,
            randKey: 0,
        }
    },
    computed: {
        metroLogo() {
            if (this.town.toLowerCase().includes("москва")) {
                return "metro";
            } if (this.town.toLowerCase().includes("санкт")) {
                return "metro_spb";
            } else {
                return null;
            }
        }
    },
    methods: {
        openMap() {
            if (this.mapIsOpened) {
                this.mapIsOpened = false;
                this.map.styles.height = "100px";
                this.randKey = Math.round(Math.random() * 1000);
                for (const [key, value] of Object.entries(this.map.detailedControls)) {
                    this.map.detailedControls[key] = { ...value, visible: false }
                }
                this.map.behaviors = [];
            } else {
                this.mapIsOpened = true;
                this.map.styles.height = "500px";
                this.randKey = Math.round(Math.random() * 1000);
                for (const [key, value] of Object.entries(this.map.detailedControls)) {
                    this.map.detailedControls[key] = { ...value, visible: true }
                }
                this.map.behaviors = ["drag", "multiTouch", "scrollZoom"]
            }
        },
    }
}
</script>

<style scoped></style>