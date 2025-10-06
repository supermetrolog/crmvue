<template>
    <YandexMapControlButton>
        <MapDropdownControl align="center" :theme="currenTheme">
            <template #trigger>
                <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-layer-group" />
                    <span>Слои</span>
                    <i class="fa-solid fa-caret-down"></i>
                </div>
            </template>
            <template #menu>
                <MapDropdownItemControl
                    @handle="setLayer('map')"
                    :active="isSchema"
                    label="Схема"
                    icon="fa-solid fa-map-location-dot"
                    :close-on-click="false"
                />
                <MapDropdownItemControl
                    @handle="setLayer('satellite')"
                    :active="!isSchema"
                    label="Спутник"
                    icon="fa-solid fa-satellite-dish"
                    :close-on-click="false"
                />
            </template>
        </MapDropdownControl>
    </YandexMapControlButton>
</template>
<script setup lang="ts">
import { YandexMapControlButton } from 'vue-yandex-maps';
import MapDropdownControl from '@/components/common/Map/Control/MapDropdownControl.vue';
import MapDropdownItemControl from '@/components/common/Map/Control/MapDropdownItemControl.vue';
import { MapType } from '@/components/common/Map/MapContainer.vue';
import { computed } from 'vue';
import { useMapContext } from '@/components/common/Map/useMapContext';

const layer = defineModel<MapType>();

const isSchema = computed(() => layer.value === 'map');

function setLayer(value: MapType) {
    layer.value = value;
}

const { settings } = useMapContext();

const currenTheme = computed(() => settings.value.theme);
</script>
