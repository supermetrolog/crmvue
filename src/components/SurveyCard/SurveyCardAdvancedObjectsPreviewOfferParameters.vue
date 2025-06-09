<template>
    <div class="survey-form-object-preview-offer__parameters">
        <SurveyFormObjectsPreviewOfferParameter
            icon="fa-solid fa-arrows-down-to-line fa-rotate-180"
        >
            <span v-if="!object.is_land">{{ offer.ceiling }} м</span>
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-weight-hanging">
            <WithUnitType
                v-if="!object.is_land && offer.load"
                :value="offer.load"
                :unit-type="unitTypes.TON_PER_SQUARE_METER"
            />
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-bolt">
            <WithUnitType
                v-if="offer.power && offer.power"
                :value="Number(offer.power)"
                :unit-type="unitTypes.KILOWATT"
            />
            <p v-else>-</p>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-temperature-three-quarters">
            <WithUnitType
                v-if="!object.is_land && offer.temperature"
                :value="offer.temperature"
                :unit-type="unitTypes.CELCIUS"
            />
            <span v-else>-</span>
        </SurveyFormObjectsPreviewOfferParameter>
        <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-archway">
            <p v-if="offer.gates">{{ offer.gates }} ворот</p>
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
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import SurveyFormObjectsPreviewOfferParameter from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameter.vue';

defineProps({
    offer: {
        type: Object,
        required: true
    },
    object: {
        type: Object,
        required: true
    }
});
</script>
