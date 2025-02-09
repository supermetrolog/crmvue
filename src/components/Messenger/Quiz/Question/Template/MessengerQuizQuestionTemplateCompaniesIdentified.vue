<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        class="messenger-quiz__question"
    >
        <template #description="{ disabled, mainAnswer }">
            <div v-if="mainAnswer === true">
                <MessengerQuizFormCompanyPicker v-model="companies" :disabled="disabled" />
            </div>
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import MessengerQuizFormCompanyPicker from '@/components/Messenger/Quiz/Form/MessengerQuizFormCompanyPicker.vue';
import { ref, useTemplateRef } from 'vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';

defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean
});

const companies = ref([]);

const injectCompaniesToForm = (form, companies) => {
    const answer = form.find(element =>
        element.effects.has(quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED)
    );
    if (!answer) return;

    answer.value = companies.map(company => ({
        company_id: company.id,
        area: company.area
    }));
};

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer.value === true) {
        if (companies.value?.length) injectCompaniesToForm(form, companies.value);
    }

    return form;
}

function validate() {
    return templateRef.value.validate();
}

defineExpose({ getForm, validate });
</script>
