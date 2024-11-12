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
                            <DashboardChip class="my-2 dashboard-bg-light">
                                На объекте сидят:
                            </DashboardChip>
                            <div class="d-flex gap-2 flex-wrap">
                                <MessengerQuizPreviewCompany
                                    v-for="company in toCompanies(answers)"
                                    :key="company.company_id"
                                    :company="company"
                                    :name="companyNames[company.company_id]"
                                    :loading="companiesIsLoading"
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
import { computed, onMounted, ref, shallowReactive } from 'vue';
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

const isLoading = ref(false);
const companiesIsLoading = ref(false);
const quiz = ref(null);

const companyNames = shallowReactive({});

const hasQuestionWithCompaniesInfo = computed(() => {
    if (!quiz.value) return false;

    return quiz.value.questions.some(question => question.id === CUSTOM_QUESTION_ID);
});

const toCompanies = answer => {
    return answer[0].surveyQuestionAnswer.value;
};

const hasCompanyInfo = answer => {
    return answer[0].surveyQuestionAnswer.value?.length;
};

const fetchQuiz = async () => {
    isLoading.value = true;
    quiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
};

const injectCompanyNames = companies => {
    for (const company of companies) {
        companyNames[company.id] = company.full_name;
    }
};

const fetchCompanies = async () => {
    const question = quiz.value.questions.find(question => question.id === CUSTOM_QUESTION_ID);

    const answer = question?.answers?.['text-answer']?.[0]?.surveyQuestionAnswer?.value;
    if (!answer || !(answer instanceof Array)) return;

    const companyIds = answer.map(company => company.company_id);

    companiesIsLoading.value = true;

    const companies = await api.companies.searchCompanies({ id: companyIds });
    if (companies.data.length) injectCompanyNames(companies.data);

    companiesIsLoading.value = false;
};

onMounted(async () => {
    await fetchQuiz();

    if (hasQuestionWithCompaniesInfo.value) {
        await fetchCompanies();
    }
});
</script>
