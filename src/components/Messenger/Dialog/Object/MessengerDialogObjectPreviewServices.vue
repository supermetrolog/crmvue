<template>
    <div class="messenger-dialog-object-preview-commission messenger-dialog-preview-tippy">
        <p class="messenger-dialog-preview-tippy__title mb-2">В стоимость включено:</p>
        <p v-for="option in formattedOptions" :key="option.id" class="mb-1">+ {{ option.label }}</p>
        <p v-if="!formattedOptions.length" class="messenger-warning">Не заполнено</p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';

const props = defineProps({
    options: {
        type: [String, Array],
        required: true
    }
});

const formattedOptions = computed(() => {
    if (Array.isArray(props.options))
        return props.options.map((element, index) => ({
            id: index,
            label: dealOptions.publicServices[Number(element)]
        }));

    try {
        if (typeof props.options === 'string')
            return JSON.parse(props.options).map((element, index) => ({
                id: index,
                label: dealOptions.publicServices[Number(element)]
            }));
    } catch (e) {
        return [];
    }

    return [];
});
</script>
