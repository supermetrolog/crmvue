<template>
    <div class="map-banner">
        <AnimationTransition :speed="0.4">
            <div v-if="scalable" class="map-banner__actions">
                <UiButtonIcon
                    @click.stop="decreaseZoom"
                    :disabled="loading"
                    icon="fa-solid fa-minus"
                    color="white"
                    rect
                    class="map-banner__action"
                    label="Отдалить"
                />
                <UiButtonIcon
                    @click.stop="increaseZoom"
                    :disabled="loading"
                    icon="fa-solid fa-plus"
                    color="white"
                    rect
                    class="map-banner__action"
                    label="Приблизить"
                />
            </div>
        </AnimationTransition>
        <RouterLink :to class="map-banner__wrapper">
            <MapContainer ref="map"
:zoom
:center
:controls="[]"
class="map-banner__map">
                <MapMarkerCollection :collection="markers" :grid-size="64" />
            </MapContainer>
        </RouterLink>
        <div class="map-banner__footer">
            <slot name="footer">
                <AnimationTransition :speed="0.4" appear>
                    <UiButton
                        :as="RouterLink"
                        :to
                        color="white"
                        center
                        class="map-banner__button"
                        icon="fa-solid fa-map-location-dot"
                        :disabled="loading"
                    >
                        <slot name="label">
                            {{ label }}
                        </slot>
                    </UiButton>
                </AnimationTransition>
            </slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { RouteLocationRaw, RouterLink } from 'vue-router';
import { useTemplateRef } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import MapMarkerCollection, {
    MapCollectionItem
} from '@/components/common/Map/MapMarkerCollection.vue';
import { LngLat } from '@yandex/ymaps3-types';

withDefaults(
    defineProps<{
        center?: LngLat;
        markers?: MapCollectionItem[];
        to: RouteLocationRaw;
        zoom?: number;
        gridSize?: number;
        label?: string;
        loading?: boolean;
        scalable?: boolean;
    }>(),
    { label: 'Показать на карте', markers: () => [], zoom: 8, gridSize: 64 }
);
// zoom

const map = useTemplateRef('map');

function increaseZoom() {
    if (map.value) {
        map.value.increaseZoom();
    }
}

function decreaseZoom() {
    if (map.value) {
        map.value.decreaseZoom();
    }
}
</script>
<style lang="scss">
.map-banner {
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &__footer {
        position: absolute;
        display: block;
        left: 20px;
        right: 20px;
        bottom: 20px;
    }

    &__button {
        width: 100%;
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 30px rgba(0, 0, 0, 0.1);
    }

    &__map {
        height: 140px;
        touch-action: none;
        pointer-events: none;
        cursor: pointer;

        .ymap-container {
            border: none;
        }
    }

    &__actions {
        position: absolute;
        top: 10px;
        right: 20px;
        z-index: 1;
        display: flex;
        gap: 5px;
    }

    &__action {
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 30px rgba(0, 0, 0, 0.1);
    }
}
</style>
