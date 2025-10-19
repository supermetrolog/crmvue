<template>
    <Tippy class="table-date-block">
        <i :class="icon"></i>
        <p class="table-date-block__value">{{ day }}</p>
        <template #content>
            <slot name="label" :formatted-date="day">
                <p>{{ label }}</p>
            </slot>
        </template>
    </Tippy>
</template>
<script setup>
import { computed } from 'vue';
import { Tippy } from 'vue-tippy';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';

const props = defineProps({
    label: String,
    date: { type: [Number, String, Date], required: true },
    icon: {
        type: String,
        default: 'fa-solid fa-clock-rotate-left'
    }
});

const day = computed(() => {
    return toBeautifulDateFormat(props.date);
});
</script>
