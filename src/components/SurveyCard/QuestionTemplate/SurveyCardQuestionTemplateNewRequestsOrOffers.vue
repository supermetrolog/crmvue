<template>
    <div v-if="hasPositiveAnswer" class="mt-1">
        <div v-if="offers.length" class="mb-1">
            <p>Новые предложения ({{ offers.length }}):</p>
            <div class="d-flex flex-wrap gap-1">
                <SurveyCardNewOffer v-for="offer in offers" :key="offer.id" :offer="offer" />
            </div>
        </div>
        <div v-if="requests.length">
            <p>Новые запросы ({{ offers.length }}):</p>
            <div class="d-flex flex-wrap gap-1">
                <SurveyCardNewRequest
                    v-for="request in requests"
                    :key="request.id"
                    :request="request"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import SurveyCardNewOffer from '@/components/SurveyCard/SurveyCardNewOffer.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import SurveyCardNewRequest from '@/components/SurveyCard/SurveyCardNewRequest.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const mainAnswer = computed(() => props.question.answers?.['yes-no']?.[0]);

const hasPositiveAnswer = computed(() => {
    if (mainAnswer.value) return mainAnswer.value.surveyQuestionAnswer?.value === true;
    return false;
});

const offersAnswer = computed(() =>
    props.question.answers.custom.find(answer =>
        answer.effects.some(effect => effect.kind === quizEffectKinds.HAS_NEW_OFFERS)
    )
);

const offers = computed(() => {
    if (offersAnswer.value && offersAnswer.value?.surveyQuestionAnswer?.value?.length) {
        return offersAnswer.value?.surveyQuestionAnswer?.value.map((offer, key) => ({
            id: key,
            ...offer
        }));
    }

    return [];
});

const requestsAnswer = computed(() =>
    props.question.answers.custom.find(answer =>
        answer.effects.some(effect => effect.kind === quizEffectKinds.HAS_NEW_REQUESTS)
    )
);

const requests = computed(() => {
    if (requestsAnswer.value && requestsAnswer.value?.surveyQuestionAnswer?.value?.length) {
        return requestsAnswer.value?.surveyQuestionAnswer?.value.map((request, key) => ({
            id: key,
            ...request
        }));
    }

    return [];
});
</script>
