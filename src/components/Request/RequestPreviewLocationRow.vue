<template>
    <div class="request-preview-location__row">
        <span class="request-preview-location__name">{{ formattedLabel }}: </span>
        <span class="request-preview-location__value">
            <slot />
        </span>
    </div>
</template>
<script setup>
import { ucFirst } from '@/utils/formatters/string.js';
import { computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    }
});

const formattedLabel = computed(() => ucFirst(props.label));
</script>
