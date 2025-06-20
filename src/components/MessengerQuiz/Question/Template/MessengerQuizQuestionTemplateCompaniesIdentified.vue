<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        class="messenger-quiz__question"
    >
        <template #description="{ disabled, mainAnswer }">
            <MessengerQuizFormCompanyPicker
                v-if="mainAnswer === true"
                v-model="companies"
                :disabled="disabled"
                class="my-2"
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import MessengerQuizFormCompanyPicker from '@/components/MessengerQuiz/Form/MessengerQuizFormCompanyPicker.vue';
import { ref, useTemplateRef } from 'vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizQuestionTemplateDefault from '@/components/MessengerQuiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import { isArray } from '@/utils/helpers/array/isArray.ts';

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

function injectCompaniesToForm(form, companies) {
    const answer = form.find(element =>
        element.effects.has(quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED)
    );

    if (answer) answer.value = companies.value;
}

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer.value === true) {
        injectCompaniesToForm(form, companies.value);
    }

    return form;
}

function validate(withNotify = true) {
    return templateRef.value.validate(withNotify);
}

function setForm(form) {
    const companiesAnswer = form['text-answer'].find(answer =>
        answer.effects.has(quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED)
    );

    if (companiesAnswer && isArray(companiesAnswer.value)) {
        companies.value = companiesAnswer.value.map(companyInfo => {
            const payload = {
                area: companyInfo.area,
                description: companyInfo.description,
                name: companyInfo.company_name
            };

            if (companyInfo.new) {
                payload.custom = true;
            } else {
                payload.id = companyInfo.company_id;
            }

            return payload;
        });
    }

    templateRef.value.setForm(form);
}

function setAnswer(value) {
    templateRef.value.setAnswer(value);
}

function resetAnswer() {
    templateRef.value.resetAnswer();
}

defineExpose({ getForm, validate, setForm, setAnswer, resetAnswer });
</script>
