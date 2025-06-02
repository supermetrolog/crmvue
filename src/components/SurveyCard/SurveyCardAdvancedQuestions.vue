<template>
    <div>
        <p class="mb-2 font-weight-semi">Дополнительные вопросы:</p>
        <div class="d-flex flex-column gap-2">
            <SurveyCardQuestion
                v-for="question in questions"
                :key="question.id"
                :question="question"
                class="messenger-quiz-preview__element"
            />
            <EmptyData v-if="questions.length === 0">Вопросы не заполнены...</EmptyData>
        </div>
    </div>
</template>
<script setup>
import SurveyCardQuestion from '@/components/SurveyCard/SurveyCardQuestion.vue';
import EmptyData from '@/components/common/EmptyData.vue';

defineProps({
    questions: {
        type: Array,
        required: true
    }
});
</script>
