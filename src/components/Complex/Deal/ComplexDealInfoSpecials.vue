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
<script setup>
import { entityOptions } from '@/const/options/options';
import { computed, inject } from 'vue';

const dealType = inject('dealType');
const props = defineProps({
    specials: {
        type: Object,
        required: true
    }
});

const specialsType = computed(() =>
    dealType.id === entityOptions.deal.typeStatement.SALE ? 'BTS' : 'BTR'
);
const hasPlan = computed(
    () => props.specials.built_to_suit_plan === entityOptions.deal.builtToSuitPlanStatement.EXIST
);
</script>
