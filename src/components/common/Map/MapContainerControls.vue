<template>
    <YandexMapControls :settings>
        <slot />
    </YandexMapControls>
</template>
<script setup lang="ts">
import type { YMapControlsProps } from '@yandex/ymaps3-types';
import { YandexMapControls } from 'vue-yandex-maps';
import { computed } from 'vue';

const props = defineProps<{
    position: YMapControlsProps['position'];
    orientation?: YMapControlsProps['orientation'];
}>();

const settings = computed(() => ({
    position: props.position,
    orientation: props.orientation
}));
</script>
