<template>
    <UiButton
        :style="{ 'background-color': color }"
        :color="
            todayVisits.length || nearestVisits.length || expiredVisits.length ? 'danger' : 'white'
        "
        :tooltip
        small
        class="fs-2 w-100"
        center
    >
        {{ label }}
    </UiButton>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
});

// events

const today = dayjs().startOf('day');

const expiredVisits = computed(() =>
    props.tasks.filter(task => dayjsFromMoscow(task.start).isBefore(today, 'day'))
);

const todayVisits = computed(() =>
    props.tasks.filter(task => dayjsFromMoscow(task.start).isSame(today, 'day'))
);

const nearestVisits = computed(() => {
    const nearestDate = today.add(3, 'day');

    return props.tasks.filter(task => {
        const taskDate = dayjsFromMoscow(task.start);

        return taskDate.isAfter(today, 'day') && taskDate.isBefore(nearestDate);
    });
});

const label = computed(() => {
    if (todayVisits.value.length || nearestVisits.value.length) return 'У вас встреча!';
    if (expiredVisits.value.length) return 'Пропущена встреча!';
    return 'Назначена встреча';
});

const color = computed(() => {
    if (todayVisits.value.length) return '#FE6A49';
    if (nearestVisits.value.length) return '#fbe66b';
    if (expiredVisits.value.length) return '#810303';
    return '#e8e8e8';
});

const tooltip = computed(() => {
    if (todayVisits.value.length)
        return `Запланирована встреча сегодня в ${toDateFormat(todayVisits.value[0].start, 'HH:mm')}`;
    if (nearestVisits.value.length)
        return `Запланирована встреча на ${toDateFormat(nearestVisits.value[0].start, 'D.MM, HH:mm')}`;
    if (expiredVisits.value.length)
        return `Просрочена встреча на ${toDateFormat(expiredVisits.value[0].start, 'D.MM, HH:mm')}`;
    return `Запланирована встреча на ${toDateFormat(props.tasks[0].start, 'D.MM, HH:mm')}`;
});
</script>
