<template>
    <div class="messenger-quiz-preview">
        <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
        <div v-else-if="currentQuiz">
            <MessengerQuizPreviewInfo @edit="$emit('edit', currentQuiz)" :quiz="currentQuiz" />
            <MessengerQuizPreviewTasks
                v-if="currentQuiz.tasks.length"
                v-model:tasks="currentQuiz.tasks"
                @hide="$emit('hide')"
                class="messenger-quiz-preview__element mb-2"
            />
            <div v-if="currentQuiz.questions.length" class="messenger-quiz-preview__list">
                <MessengerQuizPreviewQuestion
                    v-for="question in currentQuiz.questions"
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
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

defineEmits(['hide', 'edit']);
const props = defineProps({
    quizId: Number,
    quiz: Object
});

const isLoading = ref(isNullish(props.quiz));

const questionWithCompaniesInfo = computed(() => {
    return currentQuiz.value.questions.find(question => {
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
    return currentQuiz.value.questions.find(question => {
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

const localQuiz = ref(null);

const currentQuiz = computed(() => {
    return props.quiz ?? localQuiz.value;
});

async function fetchQuiz() {
    isLoading.value = true;
    localQuiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
}

onMounted(() => {
    if (isNullish(props.quiz) && isNotNullish(props.quizId)) fetchQuiz();
});
</script>
