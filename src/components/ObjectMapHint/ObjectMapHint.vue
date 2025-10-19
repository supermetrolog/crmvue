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
        <p v-if="hasOfferState" class="mt-2">
            <i :class="offerStateIcon" class="mr-1" />
            <span class="op-7">{{ offerStateLabel }}</span>
        </p>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { toNumberFormat } from '@/utils/formatters/number';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

export type ObjectMapMarkerHint = {
    visual_id: string;
    address: string;
    class: number | string | null;
    is_land: number;
    area_building: number;
    test_only: number | null;
    offer_state: number | null;
};

const props = defineProps<{
    hint: ObjectMapMarkerHint;
}>();

const hasClass = computed(() => props.hint.class && props.hint.class !== '0');

const classLabel = computed(() => objectOptions.class[props.hint.class]);
const areaBuilding = computed(() => toNumberFormat(props.hint.area_building));

const offerStateLabelMap = {
    2: 'Есть активные предложения',
    1: 'Есть пассивные предложения',
    0: 'Нет предложений'
};

const offerStateIconMap = {
    2: 'fa-solid fa-up-long text-success',
    1: 'fa-solid fa-down-long text-danger',
    0: 'fa-solid fa-ban text-grey'
};

const hasOfferState = computed(() => isNotNullish(props.hint.offer_state));

const offerStateLabel = computed(() => offerStateLabelMap[props.hint.offer_state]);
const offerStateIcon = computed(() => offerStateIconMap[props.hint.offer_state]);
</script>
