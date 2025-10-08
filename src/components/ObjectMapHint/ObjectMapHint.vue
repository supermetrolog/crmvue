<template>
    <div class="object-map-hint">
        <p class="mb-1">
            <span v-if="hint.test_only" class="mr-1 text-danger font-weight-semi">ТЕСТ.</span>
            <span>{{ hint.is_land ? 'Участок' : 'Строение' }} #{{ hint.visual_id }}</span>
            <span v-if="hasClass">, {{ classLabel }} класс</span>
            <span v-if="!hint.is_land && hint.area_building">
                <span>, </span>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">{{ areaBuilding }}</WithUnitType>
            </span>
        </p>
        <p class="text-grey">{{ hint.address }}</p>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { toNumberFormat } from '@/utils/formatters/number';

export type ObjectMapMarkerHint = {
    visual_id: string;
    address: string;
    class: number | null;
    is_land: number;
    area_building: number;
    test_only: number | null;
};

const props = defineProps<{
    hint: ObjectMapMarkerHint;
}>();

const hasClass = computed(() => props.hint.class && props.hint.class !== '0');

const classLabel = computed(() => objectOptions.class[props.hint.class]);
const areaBuilding = computed(() => toNumberFormat(props.hint.area_building));
</script>
