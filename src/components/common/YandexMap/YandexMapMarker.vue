<template>
    <div></div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue';

const registerMarker = inject('add');
const deleteMarker = inject('remove');

const props = defineProps<{
    coords: number[];
    markerId: number | string;
    balloonContentBody?: string;
    balloonContentHeader?: string;
    balloonContentFooter?: string;
    hintContent?: string;
    clusterCaption?: string;
}>();

onMounted(() => {
    registerMarker({
        type: 'Feature',
        id: props.markerId,
        geometry: { type: 'Point', coordinates: props.coords },
        properties: {
            balloonContentHeader: props.balloonContentHeader,
            balloonContentBody: props.balloonContentBody,
            balloonContentFooter: props.balloonContentFooter,
            hintContent: props.hintContent,
            clusterCaption: props.clusterCaption
        },
        options: {
            preset: 'islands#circleIcon'
        }
    });
});

onBeforeUnmount(() => {
    deleteMarker({ id: props.markerId });
});
</script>
