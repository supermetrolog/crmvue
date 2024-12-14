<template>
    <DashboardChip v-tippy="label" class="table-date-block dashboard-bg-light" with-icon>
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span class="table-date-block__value">{{ day }}, {{ time }}</span>
    </DashboardChip>
</template>
<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

const props = defineProps({
    label: { type: String, required: true },
    date: { type: [Number, String, Date], required: true }
});

const day = computed(() => {
    const date = dayjs(props.date);
    return date.isToday() ? 'Сегодня' : date.format('D.MM.YY');
});

const time = computed(() => dayjs(props.date).format('HH:mm'));
</script>
