<template>
    <div class="complex-map" :class="{ active: mapIsOpened }">
        <div class="complex-map__description">
            <div v-if="location.regionRecord" class="complex-map__label">
                {{ ucFirst(location.regionRecord.title) }}
            </div>
            <div v-if="location.districtTypeRecord" class="complex-map__label">
                {{ ucFirst(location.districtTypeRecord.title) }}
                {{ ucFirst(location.districtRecord.title) }}
            </div>
            <div v-if="location.directionRecord" class="complex-map__label">
                {{ ucFirst(location.directionRecord.title) }}
            </div>
            <div v-if="location.townRecord" class="complex-map__label">
                {{ ucFirst(location.townRecord.townTypeRecord.title) }}
                {{ ucFirst(location.townRecord.title) }}
            </div>
            <div v-if="location.highwayRecord" class="complex-map__label">
                {{ ucFirst(location.highwayRecord.title) }} шоссе
            </div>
            <div
                v-if="location.metroRecord"
                class="complex-map__label"
                :title="location.metroRecord.title"
            >
                <div>
                    <img src="@/assets/image/metro.png" alt="метро" />
                </div>
                <span>{{ ucFirst(location.metroRecord.title, true) }}</span>
            </div>
            <div v-if="location.fromMkad" class="complex-map__label">
                {{ location.fromMkad }} км от МКАД
            </div>
            <div class="complex-map__actions">
                <Tooltip>
                    <template #trigger>
                        <button class="complex-map__label complex-map__action">
                            <i class="fa-solid fa-question"></i>
                        </button>
                    </template>
                    <template #content>
                        <ComplexMapDescription v-if="location.id" :location="location" />
                        <p v-else>Информация о локации не доступна..</p>
                    </template>
                </Tooltip>
                <button v-tippy="'Редактировать'" class="complex-map__label complex-map__action">
                    <i class="fas fa-pen" />
                </button>
                <button v-tippy="'Добавить'" class="complex-map__label complex-map__action">
                    <i class="fas fa-plus" />
                </button>
            </div>
            <div v-tippy="'Открыть карту'" @click="openMap" class="complex-map__control">
                <i class="fas fa-map-marker-alt" :class="{ active: mapIsOpened }"></i>
            </div>
        </div>
        <YandexMapView
            :key="randKey"
            :settings="map.settings"
            :styles="map.styles"
            :detailed-controls="map.detailedControls"
            :behaviors="map.behaviors"
            :controls="map.controls"
            :coords="[location.latitude, location.longitude]"
            :zoom="12"
        >
            <YandexMapMarker
                ref="marker"
                :marker-id="location.id"
                :coords="[location.latitude, location.longitude]"
            />
        </YandexMapView>
    </div>
</template>

<script setup>
import YandexMapView from '@/components/common/YandexMap/YandexMapView.vue';
import YandexMapMarker from '@/components/common/YandexMap/YandexMapMarker.vue';
import Tooltip from '@/components/common/Tooltip.vue';
import ComplexMapDescription from '@/components/Complex/ComplexMapDescription.vue';
import { nextTick, onUnmounted, reactive, shallowRef } from 'vue';
import { ucFirst } from '@/utils/formatter.js';

defineProps({
    location: {
        type: Object,
        required: true
    }
});

const map = reactive({
    settings: {
        apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
        height: '60px'
    },
    controls: [
        'geolocationControl',
        'searchControl',
        'trafficControl',
        'typeSelector',
        'zoomControl',
        'rulerControl'
    ],
    styles: {
        height: '60px',
        width: '100%'
    },
    detailedControls: {
        zoomControl: {
            position: {
                right: '10px',
                top: '110px'
            },
            visible: false
        },
        geolocationControl: {
            position: {
                top: '70px',
                left: '10px'
            },
            visible: false
        },
        trafficControl: {
            position: {
                top: '70px',
                right: '140px'
            },
            visible: false
        },
        typeSelector: {
            position: {
                top: '70px',
                right: '45px'
            },
            visible: false
        },
        searchControl: {
            position: {
                top: '70px',
                left: '45px'
            },
            visible: false
        },
        fullscreenControl: {
            position: {
                top: '70px',
                right: '10px'
            },
            visible: false
        },
        rulerControl: {
            visible: false
        }
    },
    behaviors: []
});

const mapIsOpened = shallowRef(false);
const randKey = shallowRef(0);
let timeout = null;

const openMap = () => {
    clearTimeout(timeout);

    if (mapIsOpened.value) {
        mapIsOpened.value = false;
        map.styles.height = '60px';
        timeout = setTimeout(() => {
            randKey.value = randKey.value + 1;
        }, 1000);

        Object.keys(map.detailedControls).forEach(key => {
            map.detailedControls[key].visible = false;
        });

        map.behaviors = [];
    } else {
        mapIsOpened.value = true;
        map.styles.height = '500px';
        timeout = setTimeout(() => {
            randKey.value = randKey.value + 1;
        }, 1000);

        Object.keys(map.detailedControls).forEach(key => {
            map.detailedControls[key].visible = true;
        });

        map.behaviors = ['drag', 'multiTouch', 'scrollZoom'];
    }
};

onUnmounted(() => {
    clearTimeout(timeout);
});
</script>
