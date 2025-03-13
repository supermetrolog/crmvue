<template>
    <component :is="currentComponent" v-if="currentComponent" :question />
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardQuestionTemplateCustomOffers from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomOffers.vue';
import SurveyCardQuestionTemplateCustomRequests from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomRequests.vue';
import SurveyCardQuestionTemplateCustomFreeArea from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomFreeArea.vue';
import SurveyCardQuestionTemplateCustomWantsToSell from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomWantsToSell.vue';
import SurveyCardQuestionTemplateCustomNewRequestsOrOffers from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomNewRequestsOrOffers.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    'free-area': SurveyCardQuestionTemplateCustomFreeArea,
    'wants-to-sell': SurveyCardQuestionTemplateCustomWantsToSell,
    requests: SurveyCardQuestionTemplateCustomRequests,
    offers: SurveyCardQuestionTemplateCustomOffers,
    'new-requests-or-offers': SurveyCardQuestionTemplateCustomNewRequestsOrOffers
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template];
});
</script>
