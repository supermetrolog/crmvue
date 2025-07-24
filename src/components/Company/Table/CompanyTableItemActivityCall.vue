<template>
    <UiButton
        :style="{ 'background-color': color }"
        :icon
        :tooltip
        :color="todayCall || expiredCall ? 'danger' : 'light'"
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
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date.ts';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
});

// events

const today = dayjs().add(3, 'h');

const expiredCall = computed(() =>
    props.tasks.find(task => dayjsFromServer(task.start).isBefore(today, 'day'))
);

const todayCall = computed(() =>
    props.tasks.find(task => dayjsFromServer(task.start).isSame(today, 'day'))
);

const label = computed(() => {
    if (todayCall.value) return 'Требуется звонок!';
    if (expiredCall.value) return 'Звонок просрочен!';
    return 'Назначен звонок';
});

const color = computed(() => {
    if (todayCall.value) return '#FE6A49';
    if (expiredCall.value) return '#810303';
    return '#e8e8e8';
});

const icon = computed(() => {
    if (todayCall.value) return 'fa-solid fa-phone-volume';
    if (expiredCall.value) return 'fa-solid fa-phone-volume';
    return 'fa-solid fa-phone';
});

const tooltip = computed(() => {
    if (todayCall.value)
        return `Запланирован звонок на сегодня в ${toDateFormat(todayCall.value.start, 'HH:mm')}`;
    if (expiredCall.value)
        return `Запланирован звонок на ${toDateFormat(expiredCall.value.start, 'D.MM, HH:mm')}`;

    return `Запланирован звонок на ${toDateFormat(props.tasks[0].start, 'D.MM, HH:mm')}`;
});
</script>
