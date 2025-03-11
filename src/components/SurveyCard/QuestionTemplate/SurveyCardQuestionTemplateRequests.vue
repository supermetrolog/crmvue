<template>
    <div v-if="answer?.surveyQuestionAnswer?.value" class="d-flex flex-column gap-1">
        <SurveyCardRequest
            v-for="request in answer?.surveyQuestionAnswer?.value"
            :key="request.id"
            :request="request"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardRequest from '@/components/SurveyCard/SurveyCardRequest.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const answer = computed(() => props.question.answers.custom[0]);
</script>
