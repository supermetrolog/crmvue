<template>
    <div v-if="answer?.surveyQuestionAnswer?.value" class="survey-card-list">
        <SurveyCardOfferMix
            v-for="offerMix in answer?.surveyQuestionAnswer?.value"
            :key="offerMix.object_id"
            :offerMix="offerMix"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardOfferMix from '@/components/SurveyCard/SurveyCardOfferMix.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const answer = computed(() => props.question.answers.custom[0]);
</script>
