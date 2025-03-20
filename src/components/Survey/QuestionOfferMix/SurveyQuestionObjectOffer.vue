<template>
    <UiField ref="fieldEl" :color small>
        <i v-if="offer.is_deleted" class="fa-solid fa-ban"></i>
        <i v-else-if="offer.status === 1" class="fa-solid fa-up-long"></i>
        <i v-else class="fa-solid fa-down-long"></i>
        <span>{{ dealType }}</span>
    </UiField>
</template>
<script setup>
import { computed, useTemplateRef } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiField from '@/components/common/UI/UiField.vue';
import { useTippy } from 'vue-tippy';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);

const color = computed(() => {
    if (props.offer.is_deleted) return 'danger-light';
    if (props.offer.status === 1) return 'success-light';
    return 'light';
});

const description = computed(() => {
    if (props.offer.is_deleted) return 'Предложения удалены';
    if (props.offer.status === 1) return 'Предложения активны';
    return 'Предложения в пассиве';
});

const fieldEl = useTemplateRef('fieldEl');

useTippy(fieldEl, { content: description });
</script>
