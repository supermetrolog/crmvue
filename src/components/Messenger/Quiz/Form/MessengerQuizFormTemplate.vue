<template>
    <div class="messenger-quiz-template">
        <MessengerQuizQuestion
            v-for="question in questions"
            :key="question.id"
            ref="questionEls"
            :question="question"
            :disabled
            class="messenger-quiz__question"
            :can-be-disabled="question.id !== QUESTION_WITH_ANY_ACTIVE_BODY"
            :with-related
        />
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { useTemplateRef } from 'vue';

const QUESTION_WITH_ANY_ACTIVE_BODY = 6;

defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    withRelated: Boolean
});
const questionEls = useTemplateRef('questionEls');

const getForm = () => {
    const form = questionEls.value.map(element => element.getForm());

    return form.flat();
};

function validate() {
    return questionEls.value.every(element => element.validate());
}

function setForm(form) {
    form.forEach((question, key) => {
        questionEls.value[key].setForm(question);
    });
}

defineExpose({ getForm, validate, setForm });
</script>
