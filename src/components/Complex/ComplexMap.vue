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
            <div v-tippy="'Открыть карту'" @click="toggleMap" class="complex-map__control">
                <i class="fas fa-map-marker-alt" :class="{ active: mapIsOpened }"></i>
            </div>
        </div>
        <MapContainer
            :center="[location.longitude, location.latitude]"
            :zoom="12"
            :style="mapStyle"
            :controls
            controls-position="right bottom"
            :behaviors
        >
            <MapMarker v-if="location" :coordinates="[location.longitude, location.latitude]" />
        </MapContainer>
    </div>
</template>

<script setup>
import Tooltip from '@/components/common/Tooltip.vue';
import ComplexMapDescription from '@/components/Complex/ComplexMapDescription.vue';
import { computed, ref } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import MapMarker from '@/components/common/Map/MapMarker.vue';

defineProps({
    location: {
        type: Object,
        required: true
    }
});

const mapIsOpened = ref(false);

const mapStyle = computed(() => ({
    height: mapIsOpened.value ? '500px' : '60px',
    width: '100%'
}));

const controls = computed(() => {
    if (mapIsOpened.value) {
        return undefined;
    }

    return [];
});

const behaviors = computed(() => {
    if (mapIsOpened.value) {
        return undefined;
    }

    return [];
});

function toggleMap() {
    mapIsOpened.value = !mapIsOpened.value;
}
</script>
