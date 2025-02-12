<template>
    <Form>
        <Loader v-if="isUpdating" small class="center" />
        <Spinner v-if="isLoading" small label="Загрузка вопросов.." class="absolute-center" />
        <template v-else>
            <MessengerQuizPreviewInfo :quiz="formData" :editable="false" />
            <hr />
            <MessengerQuizFormTemplate ref="quizForm" :questions="formData.questions" />
        </template>
        <FormGroup class="justify-content-center mt-2 gap-2">
            <Button @click="submit" success>Сохранить</Button>
            <Button @click="$emit('close')" danger>Отмена</Button>
        </FormGroup>
    </Form>
</template>
<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/MessengerQuizFormTemplate.vue';
import Spinner from '@/components/common/Spinner.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Button from '@/components/common/Button.vue';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewInfo.vue';

const emit = defineEmits(['close', 'updated']);
const props = defineProps({
    disabled: Boolean,
    formData: {
        type: Object,
        required: true
    }
});

const quizForm = useTemplateRef('quizForm');

const isLoading = ref(false);

function generateForm() {
    return props.formData.questions.map(question => {
        const payload = {};

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

        return payload;
    });
}

onMounted(async () => {
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

    isUpdating.value = false;
}
</script>
