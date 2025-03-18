<template>
    <Tab :name="dealType">
        <div class="d-flex gap-2">
            <SurveyQuestionOfferMixArea class="w-50" :offer />
            <SurveyQuestionOfferMixPrice class="w-50" :offer />
        </div>
    </Tab>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import SurveyQuestionOfferMixArea from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixArea.vue';
import SurveyQuestionOfferMixPrice from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixPrice.vue';
import Tab from '@/components/common/Tabs/Tab.vue';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
</script>
