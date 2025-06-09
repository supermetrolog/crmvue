<template>
    <div class="survey-form-object-preview-offer__parameters">
        <SurveyFormObjectsPreviewOfferParameter
            icon="fa-solid fa-arrows-down-to-line fa-rotate-180"
        >
            <span v-if="!object.is_land">{{ calculatedCeilingHeight }} м</span>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-weight-hanging">
            <WithUnitType
                v-if="!object.is_land"
                :value="calculatedLoadFloor"
                :unit-type="unitTypes.TON_PER_SQUARE_METER"
            />
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-bolt">
            <WithUnitType
                v-if="offer.power"
                :value="Number(offer.power)"
                :unit-type="unitTypes.KILOWATT"
            />
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-temperature-three-quarters">
            <WithUnitType
                v-if="offer.temperature"
                :value="offer.temperature"
                :unit-type="unitTypes.CELCIUS"
            />
            <span v-else>-</span>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-stairs">
            {{ calculatedFloorsCount }}
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fas fa-hashtag">
            {{ floorTypesTitle }}
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-sign-hanging">
            <span v-if="offer.cranes?.length">{{ offer.cranes.length }} кран(а)</span>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-archway">
            <p v-if="offer.gates?.length">{{ calculatedGatesCount }} ворот</p>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { floorOptions } from '@/const/options/floor.options.js';
import SurveyFormObjectsPreviewOfferParameter from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameter.vue';
import { plural } from '@/utils/plural.js';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    object: {
        type: Object,
        required: true
    }
});

const calculatedFloorsCount = computed(() => {
    return plural(
        new Set(props.offer.floor.filter(el => Number(el) > 0)).size,
        '%d этаж',
        '%d этажа',
        '%d этажей'
    );
});

const calculatedCeilingHeight = computed(() => {
    return toNumberOrRangeFormat(props.offer.ceiling_height_min, props.offer.ceiling_height_max);
});

const calculatedLoadFloor = computed(() => {
    return toNumberOrRangeFormat(props.offer.load_floor_min, props.offer.load_floor_max);
});

const calculatedGatesCount = computed(() => {
    let count = 0;

    for (let i = 1; i < props.offer.gates.length; i += 2) {
        count += Number(props.offer.gates[i]);
    }

    return count;
});

const floorTypesTitle = computed(() => {
    if (props.object.is_land) {
        if (props.offer.floor_types_land.length > 1) {
            return `Разные (${props.offer.floor_types_land.length})`;
        }

        if (props.offer.floor_types_land.length) {
            return floorOptions.floorTypes[props.offer.floor_types_land[0]];
        }

        return '-';
    }

    if (props.offer.floor_types.length > 1) {
        return `Разные (${props.offer.floor_types.length})`;
    }

    if (props.offer.floor_types.length) {
        return floorOptions.floorTypes[props.offer.floor_types[0]];
    }

    return '-';
});

// TODO: Что за деление?
</script>
