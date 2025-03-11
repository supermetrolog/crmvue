<template>
    <component :is="currentComponent" :question="question">
        <template v-if="isQuestionWithCompaniesInfo" #textarea="{ answers }">
            <SurveyCardQuestionTemplateCompany :answers="answers" />
        </template>
        <template v-else-if="isQuestionWithRelevantRequestsInfo" #textarea="{ answers }">
            <SurveyCardQuestionTemplateRequestsList :answers="answers" />
        </template>
    </component>
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardQuestionTemplateCompany from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateCompany.vue';
import SurveyCardQuestionTemplateRequestsList from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateRequestsList.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import SurveyCardQuestionTemplateWantsToSell from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateWantsToSell.vue';
import SurveyCardQuestionTemplateFreeArea from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateFreeArea.vue';
import SurveyCardQuestionTemplateDefault from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateDefault.vue';
import SurveyCardQuestionTemplateEquipments from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateEquipments.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    'free-area': SurveyCardQuestionTemplateFreeArea,
    'wants-to-sell': SurveyCardQuestionTemplateWantsToSell,
    equipments: SurveyCardQuestionTemplateEquipments
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? SurveyCardQuestionTemplateDefault;
});

const isQuestionWithCompaniesInfo = computed(() => {
    return (
        'text-answer' in props.question.answers &&
        props.question.answers['text-answer'].some(element =>
            element.effects.some(
                effect => effect.kind === quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED
            )
        )
    );
});

const isQuestionWithRelevantRequestsInfo = computed(() => {
    return (
        'text-answer' in props.question.answers &&
        props.question.answers['text-answer'].some(element =>
            element.effects.some(
                effect => effect.kind === quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT
            )
        )
    );
});
</script>
