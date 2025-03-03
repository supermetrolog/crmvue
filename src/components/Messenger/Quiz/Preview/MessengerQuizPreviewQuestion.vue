<template>
    <component :is="currentComponent" :question="question">
        <template v-if="isQuestionWithCompaniesInfo" #textarea="{ answers }">
            <MessengerQuizPreviewCompanyTemplate :answers="answers" />
        </template>
        <template v-else-if="isQuestionWithRelevantRequestsInfo" #textarea="{ answers }">
            <MessengerQuizPreviewRequestsTemplate :answers="answers" />
        </template>
    </component>
</template>
<script setup>
import { computed } from 'vue';
import MessengerQuizPreviewCompanyTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewCompanyTemplate.vue';
import MessengerQuizPreviewRequestsTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewRequestsTemplate.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizPreviewQuestionTemplateWantsToSell from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateWantsToSell.vue';
import MessengerQuizPreviewQuestionTemplateFreeArea from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateFreeArea.vue';
import MessengerQuizPreviewQuestionTemplateDefault from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateDefault.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    'free-area': MessengerQuizPreviewQuestionTemplateFreeArea,
    'wants-to-sell': MessengerQuizPreviewQuestionTemplateWantsToSell
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? MessengerQuizPreviewQuestionTemplateDefault;
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
