<template>
    <div class="messenger-quiz-preview">
        <div class="messenger-quiz-preview__list">
            <MessengerChatNotificationSurveyTemplatePreviewQuestion
                v-for="question in survey.questions"
                :key="question.id"
                :question="question"
                class="messenger-quiz-preview__element"
            >
                <template
                    v-if="questionWithCompaniesInfo && question.id === questionWithCompaniesInfo.id"
                    #textarea="{ answers }"
                >
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
            </MessengerChatNotificationSurveyTemplatePreviewQuestion>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowReactive } from 'vue';
import api from '@/api/api.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerQuizPreviewCompany from '@/components/Messenger/Quiz/MessengerQuizPreviewCompany.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import MessengerChatNotificationSurveyTemplatePreviewQuestion from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationSurveyTemplatePreviewQuestion.vue';

const props = defineProps({
    survey: {
        type: Object,
        required: true
    }
});

function hasCompanyInfo(answers) {
    return answers[0].surveyQuestionAnswer.value?.length;
}

function toCompanies(answers) {
    return answers[0].surveyQuestionAnswer.value;
}

const companyNames = shallowReactive({});

function injectCompanyNames(companies) {
    for (const company of companies) {
        companyNames[company.id] = getCompanyName(company);
    }
}

const questionWithCompaniesInfo = computed(() => {
    return props.survey.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(effect => effect.kind === 'companies-on-object-identified')
            )
        );
    });
});

const companiesIsLoading = ref(false);

async function fetchCompanies() {
    const answers =
        questionWithCompaniesInfo.value.answers?.['text-answer']?.[0]?.surveyQuestionAnswer?.value;

    if (isNullish(answers) || !isArray(answers)) return;

    const companyIds = answers.map(company => company.company_id);

    companiesIsLoading.value = true;

    const companies = await api.companies.searchCompanies({ id: companyIds });
    if (companies.data.length) injectCompanyNames(companies.data);

    companiesIsLoading.value = false;
}

onMounted(() => {
    if (questionWithCompaniesInfo.value) fetchCompanies();
});
</script>
