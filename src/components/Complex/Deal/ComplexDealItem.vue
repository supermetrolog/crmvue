<template>
    <div class="DealItem">
        <ComplexDealFloors :floors="floors" :object="object" />
        <ComplexDealInfo :deal="deal" />
    </div>
</template>

<script setup>
import ComplexDealFloors from '@/components/Complex/Deal/ComplexDealFloors.vue';
import ComplexDealInfo from '@/components/Complex/Deal/ComplexDealInfo.vue';
import { provide } from 'vue';

const props = defineProps({
    floors: {
        type: Array,
        default: () => []
    },
    object: {
        type: Object,
        default: null
    },
    deal: {
        type: Object,
        default: null
    }
});

provide('dealFloors', props.floors);
</script>
