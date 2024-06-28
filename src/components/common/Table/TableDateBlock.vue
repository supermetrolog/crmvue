<template>
    <div class="table-date-block">
        <p class="table-date-block__name">{{ label }}</p>
        <p class="table-date-block__value">{{ day }}</p>
        <p class="table-date-block__time">{{ time }}</p>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';

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
