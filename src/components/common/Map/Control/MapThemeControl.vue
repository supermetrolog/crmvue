<template>
    <YandexMapControlButton v-model="button" :settings="{ onClick: toggle }">
        <div
            class="d-flex align-items-center justify-content-center"
            style="width: 24px; height: 24px"
        >
            <i v-if="isLightTheme" class="fa-solid fa-sun"></i>
            <i v-else class="fa-solid fa-moon"></i>
        </div>
    </YandexMapControlButton>
</template>
<script setup lang="ts">
import { YandexMapControlButton } from 'vue-yandex-maps';
import { computed, shallowRef } from 'vue';
import { YMapControlButton } from '@yandex/ymaps3-types';
import { setInLocalstorage } from '@/services/localStorage';
import { MapTheme } from '@/components/common/Map/MapContainer.vue';

const theme = defineModel<MapTheme>();

const isLightTheme = computed(() => theme.value === 'light');

const button = shallowRef<YMapControlButton | null>(null);

function toggle() {
    const value = isLightTheme.value ? 'dark' : 'light';

    theme.value = value;

    setInLocalstorage('ui:prefer:map-theme', value);
}
</script>
