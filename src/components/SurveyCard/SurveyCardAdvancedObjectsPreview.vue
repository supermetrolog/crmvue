<template>
    <div class="survey-form-object-preview">
        <UiAccordion v-if="parametersHasWarnings" class="survey-form-object-preview__panel">
            <template #trigger="{ toggle, opened }">
                <UiAccordionButton
                    @click="toggle"
                    :class="parametersClass"
                    :label="parametersTitle"
                    :opened="opened"
                    icon="fa-solid fa-exclamation-circle survey-form-object-preview__accordion-icon"
                    expand-class="ml-auto"
                    class="w-100 br-0"
                />
            </template>
            <template #body>
                <MessengerDialogObjectPreview
                    @changed-warnings="parametersHasWarnings = $event"
                    :object
                    :show-offers="false"
                />
            </template>
        </UiAccordion>
        <div class="pt-2">
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
import SurveyFormObjectsPreviewNewOffer from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewNewOffer.vue';
import { isObject } from '@/utils/helpers/object/isObject.js';
import SurveyCardAdvancedObjectsPreviewOffer from '@/components/SurveyCard/SurveyCardAdvancedObjectsPreviewOffer.vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import UiAccordionButton from '@/components/common/UI/Accordion/UiAccordionButton.vue';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';

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

const parametersHasWarnings = ref(true);

const parametersTitle = computed(() => {
    if (parametersHasWarnings.value) {
        return 'Строение имеет недочеты в заполнении!';
    }

    return 'Просмотреть параметры строения';
});

const parametersClass = computed(() => {
    if (parametersHasWarnings.value) {
        return 'text-danger bg-white survey-form-object__accordion';
    }

    return undefined;
});
</script>
