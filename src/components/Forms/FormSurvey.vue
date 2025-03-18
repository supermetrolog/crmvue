<template>
    <Spinner v-if="isLoading" small label="Загрузка вопросов.." center class="absolute-center" />
    <UiForm v-else>
        <Loader v-if="isUpdating" small class="center" />
        <template v-else>
            <SurveyCardInfo :quiz="formData" :editable="false" />
            <hr />
            <MessengerQuizFormTemplate
                ref="quizForm"
                :questions="formData.questions"
                :company-id="companyId"
                has-available-contact
            />
        </template>
        <UiFormGroup v-if="!isLoading" class="justify-content-center mt-3 gap-2">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="$emit('close')" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </UiFormGroup>
    </UiForm>
</template>
<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplate.vue';
import Spinner from '@/components/common/Spinner.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyCardInfo from '@/components/SurveyCard/SurveyCardInfo.vue';
import { messenger } from '@/const/messenger.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['close', 'updated']);
const props = defineProps({
    disabled: Boolean,
    formData: {
        type: Object,
        required: true
    }
});

const companyId = ref(null);

const quizForm = useTemplateRef('quizForm');

const isLoading = ref(false);

function generateForm() {
    return props.formData.questions.map(question => {
        const payload = {
            question_id: question.id,
            question_template: question.template
        };

        if (question.answers?.['yes-no']?.length) {
            payload['main'] = {
                value: question.answers['yes-no'][0]?.surveyQuestionAnswer?.value,
                effects: new Set(question.answers['yes-no'][0].effects.map(effect => effect.kind))
            };
        }

        if (question.answers?.tab?.length) {
            payload['tab'] = question.answers.tab.map(answer => ({
                id: answer.id,
                value: answer.surveyQuestionAnswer?.value,
                field: answer.field_id,
                effects: new Set(answer.effects.map(effect => effect.kind))
            }));
        }

        if (question.answers?.['text-answer']?.length) {
            payload['text-answer'] = question.answers['text-answer'].map(answer => {
                return {
                    id: answer.id,
                    value: answer.surveyQuestionAnswer?.value,
                    effects: new Set(answer.effects.map(effect => effect.kind))
                };
            });
        }

        if (question.answers?.checkbox?.length) {
            payload['checkbox'] = question.answers.checkbox.map(answer => ({
                id: answer.id,
                value: answer.surveyQuestionAnswer?.value,
                effects: new Set(answer.effects.map(effect => effect.kind))
            }));
        }

        if (question.answers?.files?.length) {
            payload['files'] = question.answers.files.map(answer => ({
                id: answer.id,
                effects: new Set(answer.effects.map(effect => effect.kind)),
                files: answer.surveyQuestionAnswer?.files
            }));
        }

        if (question.answers?.custom?.length) {
            payload['custom'] = question.answers.custom.map(answer => ({
                id: answer.id,
                value: answer.surveyQuestionAnswer?.value,
                effects: new Set(answer.effects.map(effect => effect.kind))
            }));
        }

        return payload;
    });
}

async function fetchCompany() {
    const dialog = await api.messenger.getDialog(props.formData.chat_member_id);

    companyId.value =
        dialog.model_type === messenger.dialogTypes.COMPANY
            ? Number(dialog.model_id)
            : Number(dialog.model.object.company_id);
}

onMounted(async () => {
    if (!props.formData.related_survey_id) {
        isLoading.value = true;

        await fetchCompany();

        isLoading.value = false;
    }

    await nextTick();

    quizForm.value.setForm(generateForm());
});

function validate() {
    return quizForm.value?.validate();
}

const notify = useNotify();

const isUpdating = ref(false);

async function submit() {
    const isValid = validate();
    if (!isValid) return;

    const form = quizForm.value?.getForm();

    isUpdating.value = true;

    try {
        const response = await api.survey.updateWithAnswers(props.formData.id, {
            question_answers: form.map(element => ({
                question_answer_id: element.question_answer_id,
                value: element.value
            }))
        });

        if (response) {
            notify.success('Ответы успешно обновлены', 'Редактирование опросника');
            emit('updated', response);
        }
    } finally {
        isUpdating.value = false;
    }
}
</script>
