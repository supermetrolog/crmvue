<template>
    <div class="messenger-quiz-template">
        <MessengerQuizQuestion
            v-for="question in questions"
            ref="questionEls"
            :key="question.id"
            :question="question"
            class="messenger-quiz__question"
        />
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import { useTemplateRef } from 'vue';

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
