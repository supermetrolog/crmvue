<template>
    <YandexMapMiniMap v-if="isVisible" :settings="miniMapSettings" />
    <YandexMapControlButton v-else :settings="{ onClick: toggle }">
        Открыть мини-карту
    </YandexMapControlButton>
</template>
<script setup lang="ts">
import { YandexMapControlButton, YandexMapMiniMap } from 'vue-yandex-maps';
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        size?: [number, number];
    }>(),
    { size: () => [260, 170] }
);

const miniMapSettings = computed(() => ({
    size: props.size,
    showCollapsedControl: true,
    zoomOffset: 3,
    showBounds: true,
    boundsDrawingStyle: {
        fill: 'rgb(25, 109, 255)',
        fillOpacity: 0.08,
        stroke: [{ width: 1, color: '#313133' }]
    },
    onCollapsedChange: toggle
}));

const isVisible = ref(false);

function toggle() {
    isVisible.value = !isVisible.value;
}
</script>
