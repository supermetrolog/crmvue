<template>
    <div class="messenger-quiz-preview">
        <div class="messenger-quiz-preview__list">
            <MessengerChatNotificationSurveyTemplatePreviewQuestion
                v-for="question in survey.questions"
                :key="question.id"
                :question="question"
                :short
                class="messenger-quiz-preview__element"
            >
                <template
                    v-if="questionWithCompaniesInfo && question.id === questionWithCompaniesInfo.id"
                    #textarea="{ answers }"
                >
                    <MessengerQuizPreviewCompanyTemplate :answers="answers" />
                </template>
                <template
                    v-else-if="
                        questionWithRelevantRequestsInfo &&
                        question.id === questionWithRelevantRequestsInfo.id
                    "
                    #textarea="{ answers }"
                >
                    <MessengerQuizPreviewRequestsTemplate :answers="answers" />
                </template>
            </MessengerChatNotificationSurveyTemplatePreviewQuestion>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestion from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationSurveyTemplatePreviewQuestion.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizPreviewCompanyTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewCompanyTemplate.vue';
import MessengerQuizPreviewRequestsTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewRequestsTemplate.vue';

const props = defineProps({
    survey: {
        type: Object,
        required: true
    },
    short: Boolean
});

const questionWithCompaniesInfo = computed(() => {
    return props.survey.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(
                    effect => effect.kind === quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED
                )
            )
        );
    });
});

const questionWithRelevantRequestsInfo = computed(() => {
    return props.survey.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(
                    effect => effect.kind === quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT
                )
            )
        );
    });
});
</script>
