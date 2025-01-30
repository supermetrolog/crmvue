<template>
    <div class="messenger-quiz-preview">
        <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
        <div v-else-if="quiz">
            <MessengerQuizPreviewInfo :quiz="quiz" />
            <MessengerQuizPreviewTasks
                v-if="quiz.tasks.length"
                v-model:tasks="quiz.tasks"
                @hide="$emit('hide')"
                class="messenger-quiz-preview__element mb-2"
            />
            <div v-if="quiz.questions.length" class="messenger-quiz-preview__list">
                <MessengerQuizPreviewQuestion
                    v-for="question in quiz.questions"
                    :key="question.id"
                    :question="question"
                    class="messenger-quiz-preview__element"
                >
                    <template
                        v-if="
                            questionWithCompaniesInfo &&
                            question.id === questionWithCompaniesInfo.id
                        "
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
                </MessengerQuizPreviewQuestion>
            </div>
        </div>
    </div>
</template>
<script setup>
import MessengerQuizPreviewQuestion from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewQuestion.vue';
import { computed, onMounted, ref } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewInfo.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizPreviewCompanyTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewCompanyTemplate.vue';
import MessengerQuizPreviewRequestsTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewRequestsTemplate.vue';
import MessengerQuizPreviewTasks from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewTasks.vue';

defineEmits(['hide']);
const props = defineProps({
    quizId: {
        type: Number,
        required: true
    }
});

const isLoading = ref(true);

const questionWithCompaniesInfo = computed(() => {
    return quiz.value.questions.find(question => {
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
    return quiz.value.questions.find(question => {
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

const quiz = ref(null);

async function fetchQuiz() {
    isLoading.value = true;
    quiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
}

onMounted(fetchQuiz);
</script>
