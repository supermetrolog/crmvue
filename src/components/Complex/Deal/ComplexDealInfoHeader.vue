<template>
    <div class="deal-info-header">
        <ComplexDealInfoSpecials v-if="hasSpecials" :specials="specials" />
        <p class="deal-info-header__text">
            <i class="fas fa-walking"></i>
            <span> [Брокер] </span>
            <span v-if="visited === 1" class="deal-info-header__text_size_small">
                / Личное посещение
            </span>
        </p>
    </div>
</template>

<script>
import ComplexDealInfoSpecials from '@/components/Complex/Deal/ComplexDealInfoSpecials.vue';

export default {
    name: 'ComplexDealInfoHeader',
    components: { ComplexDealInfoSpecials },
    props: {
        consultant: {
            type: Object
        },
        visited: {
            type: [Number, Boolean],
            default: false
        },
        specials: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        hasSpecials() {
            return !!this.specials.built_to_suit;
        }
    }
};
</script>
