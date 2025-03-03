<template>
    <div>
        <div v-if="customAnswerEditedOffers?.surveyQuestionAnswer?.value" class="mt-1">
            <MessengerQuizPreviewQuestionTemplateOffersList
                v-if="customAnswerEditedOffersValue.edit?.length"
                class="mt-1"
                :offers="customAnswerEditedOffersValue.edit"
                label="Редактировать площади"
                item-class="dashboard-bg-warning-l"
            />
            <MessengerQuizPreviewQuestionTemplateOffersList
                v-if="customAnswerEditedOffersValue?.passive?.length"
                class="mt-1"
                :offers="customAnswerEditedOffersValue.passive"
                label="Предложения в пассив"
                item-class="dashboard-bg-danger-l"
            />
        </div>
        <div v-if="customAnswerPassiveOffers?.surveyQuestionAnswer?.value" class="mt-1">
            <div v-if="customAnswerPassiveOffersValue?.passive?.length" class="mt-1">
                <DashboardChip class="mb-1 dashboard-bg-light">
                    Предложения в пассив:
                </DashboardChip>
                <div class="d-flex gap-2 flex-wrap">
                    <UiChip
                        v-for="offer in customAnswerPassiveOffersValue.passive"
                        :key="offer.id"
                        class="dashboard-bg-danger-l"
                    >
                        {{ offer.visual_id }}
                    </UiChip>
                </div>
            </div>
            <div v-if="customAnswerPassiveOffersValue?.active?.length" class="mt-1">
                <DashboardChip class="mb-1 dashboard-bg-light">
                    Активные предложения:
                </DashboardChip>
                <div class="d-flex gap-2 flex-wrap">
                    <UiChip
                        v-for="offer in customAnswerPassiveOffersValue.active"
                        :key="offer.id"
                        class="dashboard-bg-light"
                    >
                        {{ offer.visual_id }}
                    </UiChip>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import UiChip from '@/components/common/UI/UiChip.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerQuizPreviewQuestionTemplateOffersList from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateOffersList.vue';
import { quizEffectKinds } from '@/const/quiz.js';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    short: Boolean
});

//  main

const customAnswerEditedOffers = computed(() =>
    props.question.answers.custom.find(element =>
        element.effects.some(
            effect => effect.kind === quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT_OFFERS
        )
    )
);

const customAnswerEditedOffersValue = computed(
    () => customAnswerEditedOffers.value?.surveyQuestionAnswer?.value
);

const customAnswerPassiveOffers = computed(() =>
    props.question.answers.custom.find(element =>
        element.effects.some(
            effect => effect.kind === quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_PASSIVE_OFFERS
        )
    )
);

const customAnswerPassiveOffersValue = computed(
    () => customAnswerPassiveOffers.value?.surveyQuestionAnswer?.value
);
</script>
