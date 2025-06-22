<template>
    <span ref="chipEl" class="table-date-block">
        <i :class="icon"></i>
        <span class="table-date-block__value">{{ day }}</span>
    </span>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { useTippy } from 'vue-tippy';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    label: { type: String, required: true },
    date: { type: [Number, String, Date], required: true },
    icon: {
        type: String,
        default: 'fa-solid fa-clock-rotate-left'
    }
});

const day = computed(() => {
    return toBeautifulDateFormat(props.date);
});

// tippy

useTippy(useTemplateRef('chipEl'), { content: toRef(props, 'label') });
</script>
