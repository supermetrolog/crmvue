<template>
    <div class="dashboard-card-task-date">
        <span class="dashboard-card-task__date">до {{ expiredDate }}</span>
        <i
            v-if="isExpired"
            class="dashboard-card-task__icon fa-solid fa-fire dashboard-cl-danger"
        />
        <i
            v-if="isCompleted"
            class="dashboard-card-task__icon fa-solid fa-check-circle dashboard-cl-success"
        />
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});
const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const expiredDayjs = computed(() => dayjs(props.task.end));
const isExpired = computed(() => expiredDayjs.value.diff(dayjs(), 'day') < 3 && !isCompleted.value);

const expiredDate = computed(() => {
    return expiredDayjs.value.format('DD.MM.YYYY');
});
</script>
