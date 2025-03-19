<template>
    <Tab :name="dealType" :prefix>
        <UiField small color="light" class="mb-1">{{ description }}</UiField>
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
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);

const prefix = computed(() => {
    if (props.offer.is_deleted) return `<i class="fa-solid fa-ban mr-1"></i>`;
    if (props.offer.status === 1) return `<i class="fa-solid fa-up-long mr-1"></i>`;
    return `<i class="fa-solid fa-down-long mr-1"></i>`;
});

const description = computed(() => {
    if (props.offer.is_deleted) return 'Предложения удалены';
    if (props.offer.status === 1) return 'Предложения активны';
    return 'Предложения в пассиве';
});
</script>
