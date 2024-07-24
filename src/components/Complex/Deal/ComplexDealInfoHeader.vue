<template>
    <div class="deal-info-header">
        <ComplexDealInfoSpecials v-if="hasSpecials" :specials="specials" />
        <span v-else></span>
        <div class="deal-info-header__agent">
            <span class="deal-info-header__username">{{ consultant.userProfile.full_name }}</span>
            <div v-if="visited" class="deal-info-header__visit">
                <i class="fas fa-walking"></i>
                <span>Личное посещение</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import ComplexDealInfoSpecials from '@/components/Complex/Deal/ComplexDealInfoSpecials.vue';
import { entityOptions } from '@/const/options/options';
import { computed } from 'vue';

const props = defineProps({
    consultant: {
        type: Object,
        default: () => {}
    },
    visited: {
        type: Boolean,
        default: false
    },
    specials: {
        type: Object,
        default: () => null
    }
});

const hasSpecials = computed(() => {
    return props.specials.built_to_suit === entityOptions.defaults.booleanStatement.TRUE;
});
</script>
