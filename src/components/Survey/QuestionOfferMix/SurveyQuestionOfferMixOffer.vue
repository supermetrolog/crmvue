<template>
    <UiField color="light" small>
        {{ dealType }}
    </UiField>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
</script>
