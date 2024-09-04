<template>
    <div class="messenger-quiz-preview">
        <Spinner v-if="isLoading" />
        <div v-else-if="quiz">
            <MessengerQuizPreviewInfo :quiz="quiz" />
            <div v-if="quiz.questions.length" class="messenger-quiz-preview__list">
                <MessengerQuizPreviewQuestion
                    v-for="question in questions"
                    :key="question.id"
                    :question="question"
                    class="messenger-quiz-preview__element"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import MessengerQuizPreviewQuestion from '@/components/Messenger/Quiz/MessengerQuizPreviewQuestion.vue';
import { computed, ref, shallowRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/MessengerQuizPreviewInfo.vue';
import dayjs from 'dayjs';

const props = defineProps({
    quizId: {
        type: Number,
        required: true
    }
});

const isLoading = shallowRef(false);
const quiz = ref(null);

const getQuiz = async () => {
    isLoading.value = true;
    quiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
};

const questions = computed(() =>
    quiz.value.questions.filter(element => {
        return (
            dayjs(element.created_at).isBefore(quiz.value.created_at) &&
            (element.deleted_at === null ||
                dayjs(element.deleted_at).isAfter(quiz.value.created_at))
        );
    })
);
getQuiz();
</script>
