<template>
    <div>
        <p class="mb-2 font-weight-semi">Дополнительные вопросы:</p>
        <div class="d-flex flex-column gap-2">
            <SurveyFormQuestion
                v-for="question in questions"
                :key="question.id"
                ref="questionEls"
                :question="question"
                class="messenger-quiz-question-card"
            />
        </div>
    </div>
</template>
<script setup>
import SurveyFormQuestion from '@/components/SurveyForm/SurveyFormQuestion.vue';
import { onMounted, useTemplateRef } from 'vue';

const props = defineProps({
    survey: Object,
    company: {
        type: Object,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    form: {
        type: Array,
        default: () => []
    }
});

function generateForm() {
    const questionsPayload = props.form.reduce((acc, question) => {
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

        acc[question.id] = payload;

        return acc;
    }, {});

    props.questions.forEach((question, key) => {
        const payload = questionsPayload[question.id];
        if (payload) {
            questionEls.value[key].setForm(payload);
        }
    });
}

onMounted(generateForm);

const questionEls = useTemplateRef('questionEls');

function validate() {
    return questionEls.value.every(element => element.validate());
}

function getForm() {
    return questionEls.value
        .map(element => element.getForm())
        .flat()
        .map(element => ({
            value: element.value,
            question_answer_id: element.question_answer_id,
            file: element.file
        }));
}

defineExpose({ validate, getForm });
</script>
