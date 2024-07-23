<template>
    <div class="messenger-quiz-preview">
        <Spinner v-if="isLoading" />
        <div v-else-if="quiz">
            <MessengerQuizPreviewInfo :quiz="quiz" />
            <div class="messenger-quiz-preview__list">
                <MessengerQuizPreviewQuestion
                    v-for="question in quiz.questions"
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
import { ref, shallowRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/MessengerQuizPreviewInfo.vue';

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

getQuiz();
</script>
