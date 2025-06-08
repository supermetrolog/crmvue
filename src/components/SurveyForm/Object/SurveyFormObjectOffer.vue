<template>
    <span ref="fieldEl" class="fs-2">
        <i class="fa-solid fa-up-long mr-1"></i>
        <span class="font-weight-semi">{{ dealType }}</span>
    </span>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
</script>
