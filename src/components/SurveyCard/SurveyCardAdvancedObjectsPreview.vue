<template>
    <div class="survey-form-object-preview">
        <div class="survey-form-object-preview__header">
            <p class="survey-form-object-preview__address">
                <i class="fa-solid fa-map-location-dot mr-1" />
                <span>{{ object.address }}</span>
            </p>
        </div>
        <hr />
        <SurveyFormObjectsPreviewSlider @show-preview="$emit('show-preview', $event)" :object />
        <hr />
        <div>
            <div class="survey-form-object-preview__tabs">
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                    <i class="fa-solid fa-up-long mr-1" />
                    <span>Актив ({{ tradeOffers.length }})</span>
                </SurveyFormObjectsPreviewTab>
            </div>
            <div class="survey-form-object-preview__content">
                <div
                    v-if="tradeOffers.length || answer.created?.length"
                    class="survey-form-object-preview__list"
                >
                    <SurveyFormObjectsPreviewNewOffer
                        v-for="offer in answer.created"
                        :key="offer.id"
                        v-model="offer.description"
                        :offer="offer"
                    />
                    <hr v-if="answer.created?.length && tradeOffers.length" class="w-100" />
                    <SurveyCardAdvancedObjectsPreviewOffer
                        v-for="tradeOffer in tradeOffers"
                        :key="tradeOffer.id"
                        :offer="tradeOffer"
                        :object
                    />
                </div>
                <EmptyData v-else class="mt-2">
                    Список активных торговых предложений пуст..
                </EmptyData>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import EmptyData from '@/components/common/EmptyData.vue';
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import SurveyFormObjectsPreviewSlider from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewSlider.vue';
import SurveyFormObjectsPreviewNewOffer from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewNewOffer.vue';
import { isObject } from '@/utils/helpers/object/isObject.js';
import SurveyCardAdvancedObjectsPreviewOffer from '@/components/SurveyCard/SurveyCardAdvancedObjectsPreviewOffer.vue';

defineEmits(['show-preview']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    answer: Object
});

// tabs

const TABS = {
    ACTIVE: 'active'
};

const currenTab = ref(TABS.ACTIVE);

const tradeOffers = computed(() =>
    isObject(props.answer.current) ? Object.values(props.answer.current) : []
);
</script>
