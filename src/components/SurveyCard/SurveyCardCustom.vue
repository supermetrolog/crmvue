<template>
    <component :is="currentComponent" v-if="currentComponent" :question />
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardQuestionTemplateOffers from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateOffers.vue';
import SurveyCardQuestionTemplateRequests from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateRequests.vue';
import SurveyCardQuestionTemplateFreeArea from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateFreeArea.vue';
import SurveyCardQuestionTemplateWantsToSell from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateWantsToSell.vue';
import SurveyCardQuestionTemplateNewRequestsOrOffers from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateNewRequestsOrOffers.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    'free-area': SurveyCardQuestionTemplateFreeArea,
    'wants-to-sell': SurveyCardQuestionTemplateWantsToSell,
    requests: SurveyCardQuestionTemplateRequests,
    offers: SurveyCardQuestionTemplateOffers,
    'new-requests-or-offers': SurveyCardQuestionTemplateNewRequestsOrOffers
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template];
});
</script>
