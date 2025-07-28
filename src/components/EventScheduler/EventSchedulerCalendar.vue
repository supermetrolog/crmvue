<template>
    <DatePicker
        v-model="date"
        @change="$emit('change')"
        @update-month-year="onUpdateMonthYear"
        :min-date="new Date()"
        :markers="events"
        :events-loading="eventsIsLoading"
        :size="cellSize"
        :v
        :label
        data-tour-id="scheduler:calendar"
    />
</template>
<script setup lang="ts">
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import { useCalendarEvents } from '@/composables/useCalendarEvents';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';
import { onBeforeMount, watch } from 'vue';

const date = defineModel<Date | null>('date');

defineEmits<{ (e: 'change'): void }>();

const props = withDefaults(
    defineProps<{
        label?: string;
        cellSize?: string;
        v?: object;
        option?: number | string;
    }>(),
    { label: 'Календарь', cellSize: '40px' }
);

// scheduled events

const { loadEventsAround, events, isLoading: eventsIsLoading } = useCalendarEvents();

const onUpdateMonthYear = useDebounceFn(({ month, year }) => {
    loadEventsAround(dayjs().month(month).year(year));
}, 400);

const debouncedLoadEventsAround = useDebounceFn(loadEventsAround, 400);

onBeforeMount(() => loadEventsAround(dayjs()));

watch(
    () => props.option,
    value => {
        if (value) {
            debouncedLoadEventsAround(date.value);
        }
    }
);
</script>
