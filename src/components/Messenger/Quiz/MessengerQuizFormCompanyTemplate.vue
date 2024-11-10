<template>
    <div class="messenger-quiz-template">
        <MessengerQuizQuestion
            v-for="question in questions"
            ref="questionEls"
            :key="question.id"
            :question="question"
            class="messenger-quiz__question"
            :can-be-disabled="QUESTION_WITH_ANY_ACTIVE_BODY !== question.id"
        />
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import { useTemplateRef } from 'vue';

const QUESTION_WITH_ANY_ACTIVE_BODY = 6;

defineProps({
    questions: {
        type: Array,
        required: true
    }
});
const questionEls = useTemplateRef('questionEls');

const getForm = () => {
    const form = questionEls.value.map(element => element.getForm());
    return form.flat();
};

defineExpose({ getForm });
</script>
