<template>
    <YandexMapFeature :settings />
</template>
<script setup lang="ts">
import { YandexMapFeature } from 'vue-yandex-maps';
import { LngLat, YMapFeatureProps } from '@yandex/ymaps3-types';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        coordinates: LngLat[];
        stroke?: {
            width: number;
            color: string;
        };
        fill?: string;
    }>(),
    {
        stroke: () => ({
            width: 4,
            color: '#1679e7'
        }),
        fill: '#a2c9d8'
    }
);

const settings = computed(
    () =>
        ({
            geometry: {
                type: 'Polygon',
                coordinates: [props.coordinates]
            },
            style: {
                stroke: [
                    {
                        color: props.stroke.color,
                        width: props.stroke.width
                    }
                ],
                fill: props.fill
            }
        }) satisfies Omit<YMapFeatureProps, 'geometry'> & {
            geometry: Partial<YMapFeatureProps['geometry']>;
        }
);
</script>
