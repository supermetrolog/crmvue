<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        class="messenger-quiz__question"
    >
        <template #description="{ disabled, mainAnswer, setMainAnswer }">
            <MessengerQuizQuestionTemplateCompaniesIdentifiedPicker
                v-if="withRelated"
                v-model:objects="objectsForm"
                @set-as-disabled="setMainAnswer(false)"
                :company-id="currentObject.company_id"
                :main-answer="mainAnswer"
                :disabled="!withRelated"
                class="mt-2"
                :question
            />
            <MessengerQuizFormCompanyPicker
                v-else-if="mainAnswer === true"
                v-model="companies"
                :disabled="disabled"
                class="my-2"
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import MessengerQuizFormCompanyPicker from '@/components/Messenger/Quiz/Form/MessengerQuizFormCompanyPicker.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import { isArray } from '@/utils/helpers/array/isArray.js';
import MessengerQuizQuestionTemplateCompaniesIdentifiedPicker from '@/components/Messenger/Quiz/Question/Template/CompaniesIdentified/MessengerQuizQuestionTemplateCompaniesIdentifiedPicker.vue';
import { useStore } from 'vuex';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    withRelated: Boolean
});

const companies = ref([]);

function injectCompaniesToForm(form, companies, mainAnswer) {
    const answer = form.find(element =>
        element.effects.has(quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED)
    );
    if (!answer) return;

    if (props.withRelated) {
        const relatedForm = Object.values(objectsForm.value).map(element => {
            return {
                id: element.id,
                answer: {
                    ...element.answer.description,
                    [mainAnswer.question_answer_id]: mainAnswer.value
                }
            };
        });

        answer.value = relatedForm.find(element => element.id === currentObject.value.id)?.answer[
            answer.question_answer_id
        ];
        answer.form = {
            objects: relatedForm.filter(element => element.id !== currentObject.value.id)
        };
    } else {
        answer.value = companies.value;
    }
}

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer.value === true) {
        injectCompaniesToForm(form, companies.value, mainAnswer);
    }

    return form;
}

function validate() {
    return templateRef.value.validate();
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

defineExpose({ getForm, validate, setForm });

// modelValue

const store = useStore();

const currentObject = computed(() => {
    return store.state.Messenger.currentDialog?.model?.object;
});

// form

const objectsForm = ref({});
</script>
