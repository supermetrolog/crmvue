<template>
    <div>
        <Tabs
            nav-class="messenger-quiz-form-template-offer__tabs"
            nav-item-link-class="messenger-quiz-form-template-offer__tab"
        >
            <SurveyQuestionOfferMixOffersTab
                v-for="offer in offers"
                :key="offer.id"
                :offer="offer"
            />
        </Tabs>
    </div>
</template>
<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import SurveyQuestionOfferMixOffersTab from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixOffersTab.vue';

defineProps({
    offers: {
        type: Array,
        required: true
    }
});
</script>
