<template>
    <div class="messenger-quiz-template">
        <MessengerQuizQuestion
            v-for="question in questions"
            :key="question.id"
            ref="questionEls"
            :question="question"
            class="messenger-quiz__question"
        >
            <template v-if="question.id === CUSTOM_QUESTION_ID" #description>
                <span></span>
            </template>
            <template v-if="question.id === CUSTOM_QUESTION_ID" #after-content="{ disabled }">
                <DashboardChip class="dashboard-bg-warning-l mb-2" with-icon>
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <span>
                        Данный вопрос находится в стадии доработки и не является окончательной
                        версией. Указание площади появится совсем скоро.
                    </span>
                </DashboardChip>
                <MessengerQuizFormCompanyPicker v-model="companies" :disabled="disabled" />
            </template>
        </MessengerQuizQuestion>
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import { ref, useTemplateRef } from 'vue';
import MessengerQuizFormCompanyPicker from '@/components/Messenger/Quiz/MessengerQuizFormCompanyPicker.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

const CUSTOM_QUESTION_ID = 8;

defineProps({
    questions: {
        type: Array,
        required: true
    }
});
const questionEls = useTemplateRef('questionEls');

const companies = ref([]);

const injectCompaniesToForm = (form, companies) => {
    form[3][1].value = companies.map(company => ({
        company_id: company
    }));
};

const getForm = () => {
    const form = questionEls.value.map(element => element.getForm());

    if (companies.value?.length) injectCompaniesToForm(form, companies.value);

    return form.flat();
};

defineExpose({ getForm });
</script>
