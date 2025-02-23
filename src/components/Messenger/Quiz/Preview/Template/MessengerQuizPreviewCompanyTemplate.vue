<template>
    <div>
        <template v-if="companies?.length">
            <DashboardChip class="mb-2 dashboard-bg-light">На объекте сидят:</DashboardChip>
            <div class="d-flex gap-2 flex-wrap">
                <MessengerQuizPreviewCompany
                    v-for="company in companies"
                    :key="company.company_id"
                    :company="company"
                    :name="companyNames[company.company_id]"
                    :loading="isLoading"
                />
            </div>
        </template>
        <DashboardChip v-else class="my-2 dashboard-bg-light">
            Информация отсутствует..
        </DashboardChip>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowReactive } from 'vue';
import api from '@/api/api.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerQuizPreviewCompany from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewCompany.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    answers: {
        type: Array,
        required: true
    }
});

const companies = computed(() => props.answers[0].surveyQuestionAnswer.value);

const companyNames = shallowReactive({});

function injectCompanyNames(companies) {
    for (const company of companies) {
        companyNames[company.id] = getCompanyName(company);
    }
}

const isLoading = ref(true);

async function fetchCompanies() {
    isLoading.value = true;

    const answers = props.answers[0]?.surveyQuestionAnswer?.value;

    if (isNullish(answers) || !isArray(answers)) {
        isLoading.value = false;
        return;
    }

    const companyIds = answers.map(company => company.company_id).filter(isNotNullish);

    if (companyIds.length) {
        const companies = await api.companies.searchCompanies({ id: companyIds });
        if (companies.data.length) injectCompanyNames(companies.data);
    }

    isLoading.value = false;
}

onMounted(fetchCompanies);
</script>
