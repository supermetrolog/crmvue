<template>
    <div class="messenger-quiz-preview">
        <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
        <div v-else-if="quiz">
            <MessengerQuizPreviewInfo :quiz="quiz" />
            <div v-if="quiz.questions.length" class="messenger-quiz-preview__list">
                <MessengerQuizPreviewQuestion
                    v-for="question in quiz.questions"
                    :key="question.id"
                    :question="question"
                    class="messenger-quiz-preview__element"
                >
                    <template v-if="question.id === CUSTOM_QUESTION_ID" #textarea="{ answers }">
                        <template v-if="hasCompanyInfo(answers)">
                            <DashboardChip class="dashboard-bg-warning-l mt-2" with-icon>
                                <i class="fa-solid fa-exclamation-triangle"></i>
                                <span
                                    >Вопрос находится в доработке. В скором времени будет
                                    отображаться подробная информация о компаниях.</span
                                >
                            </DashboardChip>
                            <DashboardChip class="my-2 dashboard-bg-light">
                                На объекте сидят:
                            </DashboardChip>
                            <div class="d-flex gap-2 flex-wrap">
                                <MessengerQuizPreviewCompany
                                    v-for="company in toCompanies(answers)"
                                    :key="company.company_id"
                                    :company-id="company.company_id"
                                />
                            </div>
                        </template>
                        <DashboardChip v-else class="my-2 dashboard-bg-light">
                            Информация отсутствует..
                        </DashboardChip>
                    </template>
                </MessengerQuizPreviewQuestion>
            </div>
        </div>
    </div>
</template>
<script setup>
import MessengerQuizPreviewQuestion from '@/components/Messenger/Quiz/MessengerQuizPreviewQuestion.vue';
import { onMounted, ref, shallowRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/MessengerQuizPreviewInfo.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerQuizPreviewCompany from '@/components/Messenger/Quiz/MessengerQuizPreviewCompany.vue';

const CUSTOM_QUESTION_ID = 8;

const props = defineProps({
    quizId: {
        type: Number,
        required: true
    }
});

const isLoading = shallowRef(false);
const quiz = ref(null);

const toCompanies = answer => {
    return answer[0].surveyQuestionAnswer.value;
};

const hasCompanyInfo = answer => {
    return answer[0].surveyQuestionAnswer.value?.length;
};

const getQuiz = async () => {
    isLoading.value = true;
    quiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
};

onMounted(() => {
    getQuiz();
});
</script>
