<template>
    <div class="d-flex gap-1 align-items-start">
        <div class="messenger-quiz-form-request-picker-element flex-grow-1">
            <div class="messenger-quiz-form-request-picker-element__body mb-1">
                <p class="messenger-quiz-form-request-picker-element__header">
                    <span class="messenger-quiz-form-request-picker-element__id">
                        Объект #{{ offerMix.object_id }}
                    </span>
                </p>
            </div>
            <div class="d-flex gap-1 flex-wrap">
                <DashboardChip
                    v-for="offer in offerMix.offers"
                    :key="offer.id"
                    class="dashboard-bg-light py-1 px-2 fs-1"
                >
                    <i v-if="offer.calc_area === '0'" class="fa-solid fa-down-long mr-1" />
                    <span>{{ getDealType(offer.deal_type) }}</span>
                    <WithUnitType
                        v-if="offer.calc_area !== '0'"
                        :unit-type="unitTypes.SQUARE_METERS"
                    >
                        , {{ offer.calc_area }}
                    </WithUnitType>
                </DashboardChip>
                <p v-if="!offerMix.offers?.length">Без предложений..</p>
            </div>
        </div>
        <div class="d-flex gap-1">
            <Chip class="dashboard-bg-light">{{ answerOptions[offerMix.answer] }}</Chip>
        </div>
    </div>
</template>
<script setup>
import { dealOptions } from '@/const/options/deal.options.js';
import Chip from '@/components/common/Chip.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineProps({
    offerMix: {
        type: Object,
        required: true
    }
});

function getDealType(dealType) {
    return dealOptions.type[Number(dealType) + 1];
}

const answerOptions = {
    1: 'К вопросам',
    2: 'Не опросил',
    3: 'Без изменений'
};
</script>
