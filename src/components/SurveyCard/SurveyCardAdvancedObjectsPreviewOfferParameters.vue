<template>
    <div class="survey-form-object-preview-offer__parameters">
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-stairs">
            {{ calculatedFloorsCount }}
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-archway">
            <p v-if="offer.gates">{{ offer.gates }} ворот</p>
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
        <SurveyFormObjectsPreviewOfferParameter
            icon="fa-solid fa-arrows-down-to-line fa-rotate-180"
        >
            <span v-if="!object.is_land">{{ offer.ceiling }} м</span>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fas fa-hashtag">
            {{ offer.floor_types }}
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-sign-hanging">
            <span v-if="offer.cranes?.length">{{ offer.cranes.length }} кран(а)</span>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
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
    return plural(props.offer.floors, '%d этаж', '%d этажа', '%d этажей');
});
</script>
