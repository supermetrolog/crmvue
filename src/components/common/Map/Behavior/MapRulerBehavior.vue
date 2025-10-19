<template>
    <YandexMapRuler v-if="isActive" v-model:points-state="state" :settings>
        <template #point="{ state: pointState, onDelete }">
            <div
                @click="onClickPoint"
                class="point"
                :class="{ 'point--last': pointState.index === pointState.totalCount - 1 }"
            >
                <div class="point__popup">
                    {{ getLabel(pointState) }}
                    <div @click.stop.prevent="onDelete()" class="point__delete">Удалить точку</div>
                </div>
            </div>
        </template>
        <template #previewPoint>
            <div class="point point--preview" />
        </template>
    </YandexMapRuler>
    <MapIconControl @click="isActive = !isActive" :active="isActive">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.56 14.363L14.363 3.56a1.91 1.91 0 0 1 2.7 0l3.377 3.376a1.91 1.91 0 0 1 0 2.7L9.636 20.442a1.91 1.91 0 0 1-2.7 0l-3.377-3.377a1.91 1.91 0 0 1 0-2.7zm4.12-.743l1.282-1.282 1.823 1.824a.764.764 0 1 0 1.08-1.082l-1.824-1.822 1.216-1.215 1.148 1.145a.763.763 0 0 0 1.318-.534.765.765 0 0 0-.237-.545l-1.148-1.147 1.282-1.283 1.824 1.824a.764.764 0 0 0 1.08-1.082l-1.825-1.824 1.014-1.012a.478.478 0 1 0-.676-.675L4.91 15.038a.478.478 0 0 0 .675.675l1.012-1.012 1.15 1.146a.764.764 0 1 0 1.08-1.079L7.679 13.62v.001z"
                fill="currentColor"
            ></path>
        </svg>
    </MapIconControl>
</template>
<script setup lang="ts">
import { YandexMapRuler, YandexMapRulerSettings } from 'vue-yandex-maps';
import type {
    RulerCommonState,
    RulerPointState
} from '@yandex/ymaps3-types/modules/ruler/YMapRulerCommon';
import type { RenderPointArgs } from '@yandex/ymaps3-types/modules/ruler/YMapRuler';
import { computed, ref, shallowRef } from 'vue';
import MapIconControl from '@/components/common/Map/MapIconControl.vue';

const props = withDefaults(
    defineProps<{
        mode?: YandexMapRulerSettings['type'];
        fill?: {
            color: string;
            opacity: number;
        };
    }>(),
    { mode: 'ruler', fill: () => ({ color: '#fff', opacity: 0.3 }) }
);

const isActive = defineModel<boolean>('active', { default: false });

const totalLabel = ref('');

const state = shallowRef<RenderPointArgs[] | undefined>();

const settings = computed(() => ({
    type: props.mode,
    editable: true,
    geometry: { style: featureStyle.value },
    points: [],
    onUpdate: setTotalLabel
}));

const featureStyle = computed(() => ({
    simplificationRate: 0,
    fill: props.fill.color,
    fillOpacity: props.fill.opacity,
    stroke: [
        { width: 3, opacity: 0.7, color: '#666' },
        { width: 5, opacity: 0.7, color: '#fff' }
    ]
}));

function eventHasElementTarget<T extends Event>(event: T): event is T & { target: HTMLElement } {
    return !!event.target;
}

function onClickPoint(event: MouseEvent) {
    if (eventHasElementTarget(event)) {
        event.target.classList.toggle('point--active');
    }
}

function formatDistance(distance: number): string {
    return distance > 900 ? `${roundDistance(distance / 1000)} km` : `${roundDistance(distance)} m`;
}

function formatArea(area: number): string {
    return area > 900_000
        ? `${splitNumber(roundDistance(area / 1_000_000))} km²`
        : `${splitNumber(roundDistance(area))} m²`;
}

function roundDistance(distance: number): number {
    if (distance > 100) {
        return Math.round(distance);
    }
    const factor = Math.pow(10, distance > 10 ? 1 : 2);
    return Math.round(distance * factor) / factor;
}

function splitNumber(value: number): string {
    return value.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}

function setTotalLabel(state: RulerCommonState) {
    totalLabel.value =
        state.measurements.type === 'ruler'
            ? `Дистанция: ${formatDistance(state.measurements.totalDistance)}`
            : `Площадь: ${formatArea(state.measurements.area)}`;
}

function getLabel(state: RulerPointState) {
    return state.measurements.type === 'ruler'
        ? formatDistance(state.measurements.distance)
        : formatArea(state.measurements.area);
}
</script>
<style scoped lang="scss">
.point {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    cursor: pointer;
    background: green;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &--preview {
        background: red;
    }

    &__popup {
        display: none;
    }

    &--active,
    &--last {
        .point {
            &__popup {
                display: flex;
                gap: 8px;
                align-items: center;
                position: absolute;
                bottom: calc(100% + 10px);
                background: #fff;
                white-space: nowrap;
                font-size: 12px;
                padding: 5px;
                border-radius: 8px;
                cursor: default;
            }

            &__delete {
                background: #ccc;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px 10px;
            }
        }
    }
}
</style>
