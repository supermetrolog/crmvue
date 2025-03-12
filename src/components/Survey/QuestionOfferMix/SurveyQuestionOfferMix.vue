<template>
    <div class="messenger-quiz-question-template-offer" :class="{ disabled: disabled }">
        <div class="messenger-quiz-question-template-offer__body">
            <SurveyQuestionOfferMixPreview
                @show-preview="$emit('show-preview')"
                :offer="offerMix.offers[0]"
            />
            <SurveyQuestionOfferMixContent :offer="offerMix.offers[0]" />
            <div class="messenger-quiz-question-template-offer__actions">
                <UiButtonIcon
                    @click="$emit('open')"
                    icon="fa-solid fa-eye"
                    class="dashboard-bg-gray-l"
                    label="Подробнее"
                    small
                />
                <UiButtonIcon
                    @click="$emit('object-sold')"
                    icon="fa-solid fa-dollar-sign"
                    class="dashboard-bg-danger-l"
                    label="Объект продан"
                    small
                />
                <UiButtonIcon
                    @click="$emit('object-destroyed')"
                    icon="fa-solid fa-ban"
                    class="dashboard-bg-danger-l"
                    label="Объект снесен"
                    small
                />
            </div>
        </div>
        <Tabs
            class="mt-2"
            nav-class="messenger-quiz-question-template-offer__tabs"
            nav-item-link-class="messenger-quiz-question-template-offer__tab"
        >
            <SurveyQuestionOfferMixOffer
                v-for="offer in offerMix.offers"
                :key="offer.id"
                :offer="offer"
            />
        </Tabs>
    </div>
</template>
<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import SurveyQuestionOfferMixPreview from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixPreview.vue';
import SurveyQuestionOfferMixContent from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixContent.vue';
import SurveyQuestionOfferMixOffer from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixOffer.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview', 'object-sold', 'object-destroyed', 'open']);
defineProps({
    offerMix: {
        type: Object,
        required: true
    },
    disabled: Boolean
});
</script>
