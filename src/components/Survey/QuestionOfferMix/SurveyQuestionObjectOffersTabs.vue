<template>
    <div v-if="offers.length">
        <Tabs
            nav-class="messenger-quiz-form-template-offer__tabs"
            nav-item-link-class="messenger-quiz-form-template-offer__tab"
        >
            <SurveyQuestionObjectOffersTab v-for="offer in offers" :key="offer.id" :offer="offer" />
        </Tabs>
    </div>
    <p v-else class="text-grey fs-3">
        <i class="fa-solid fa-ban mr-1" />
        <span>Нет предложений</span>
    </p>
</template>
<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import SurveyQuestionObjectOffersTab from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectOffersTab.vue';

defineProps({
    offers: {
        type: Array,
        required: true
    }
});
</script>
