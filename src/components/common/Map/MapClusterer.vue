<template>
    <YandexMapClusterer v-model="model" :grid-size :settings :zoom-on-cluster-click>
        <slot />
        <template #cluster="{ length }">
            <slot name="cluster" :length="length">
                <div class="cluster fade-in">
                    {{ length }}
                </div>
            </slot>
        </template>
    </YandexMapClusterer>
</template>
<script setup lang="ts">
import { YandexMapClusterer } from 'vue-yandex-maps';
import { computed } from 'vue';
import { YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';

const model = defineModel<YMapClusterer | null>();

const props = withDefaults(
    defineProps<{
        gridSize?: 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512;
        zoomOnClusterClick?: boolean;
        maxZoom?: number;
        settings?: Record<string, any>;
    }>(),
    {
        gridSize: 32,
        zoomOnClusterClick: true,
        settings: () => ({})
    }
);

const settings = computed(() => ({
    maxZoom: props.maxZoom,
    ...props.settings
}));
</script>
<style>
.cluster {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: #b41efd;
    color: #fff;
    border-radius: 100%;
    cursor: pointer;
    border: 6px solid #fff;
    outline: 3px solid #b41efd;
    text-align: center;
}
</style>
