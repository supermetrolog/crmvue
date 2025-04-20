<template>
    <SurveyCardQuestionTemplateDefault :question>
        <template #textarea="{ answers }">
            <div class="d-flex flex-column gap-1 text-left">
                <div v-for="answer in answers" :key="answer.id">
                    <div v-if="answer?.surveyQuestionAnswer?.value">
                        <p class="mb-1">{{ answer.value }}:</p>
                        <div class="bg-white p-1" v-html="answer.surveyQuestionAnswer.value"></div>
                    </div>
                </div>
            </div>
        </template>
    </SurveyCardQuestionTemplateDefault>
</template>
<script setup>
import SurveyCardQuestionTemplateDefault from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateDefault.vue';

defineProps({
    question: {
        type: Object,
        required: true
    }
});
</script>
