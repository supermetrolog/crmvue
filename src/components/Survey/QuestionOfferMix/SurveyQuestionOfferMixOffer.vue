<template>
    <Tab :name="dealType">
        <div class="d-flex flex-wrap gap-1 mb-1">
            <DashboardChip v-if="offer.hide_from_market" class="dashboard-bg-warning-l" with-icon>
                <i class="fa-solid fa-eye-slash"></i>
                <span>Не выгружается</span>
            </DashboardChip>
            <DashboardChip v-if="offer.test_only" class="dashboard-bg-warning-l">
                Тестовый
            </DashboardChip>
            <DashboardChip v-if="offer.is_fake" class="dashboard-bg-warning-l">Фейк</DashboardChip>
        </div>
        <div class="messenger-quiz-question-template-offer__footer">
            <SurveyQuestionOfferMixArea :offer />
            <SurveyQuestionOfferMixPrice :offer />
        </div>
    </Tab>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import Tab from '@/components/common/Tabs/Tab.vue';
import SurveyQuestionOfferMixArea from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixArea.vue';
import SurveyQuestionOfferMixPrice from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixPrice.vue';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
</script>
