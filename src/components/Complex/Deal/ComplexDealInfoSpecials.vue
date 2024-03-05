<template>
    <div class="complex-deal-specials">
        <div class="complex-deal-specials__body">
            <span>{{ specialsType }}</span>
            <span v-if="specials.built_to_suit_time">
                / {{ specials.built_to_suit_time }} мес.</span
            >
        </div>
        <div v-if="specials.built_to_suit_plan" class="complex-deal-specials__plan">
            <template v-if="hasPlan">
                <i class="fa-solid fa-check"></i>
                <span>Проект имеется</span>
            </template>
            <template v-else>
                <i class="fa-solid fa-xmark"></i>
                <span>Проект отсутствует</span>
            </template>
        </div>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options';

export default {
    name: 'ComplexDealInfoSpecials',
    inject: ['dealType'],
    props: {
        specials: {
            type: Object,
            required: true
        }
    },
    computed: {
        specialsType() {
            return this.dealType.id === entityOptions.deal.typeStatement.SALE ? 'BTS' : 'BTR';
        },
        hasPlan() {
            return (
                this.specials.built_to_suit_plan ===
                entityOptions.deal.builtToSuitPlanStatement.EXIST
            );
        }
    }
};
</script>
