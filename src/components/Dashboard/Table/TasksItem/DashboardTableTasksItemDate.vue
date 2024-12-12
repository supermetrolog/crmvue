<template>
    <div class="dashboard-card-task-date">
        <span class="dashboard-card-task__date">до {{ expiredDate }}</span>
        <span>
            <i
                v-if="isExpired"
                class="dashboard-card-task__icon fa-solid fa-fire dashboard-cl-danger"
            />
            <i
                v-if="isCompleted"
                class="dashboard-card-task__icon fa-solid fa-check-circle dashboard-cl-success"
            />
            <i
                v-if="isForMe"
                v-tippy="
                    task.is_viewed ? `Задача просмотрена ${viewedAt}` : 'Задача не просмотрена'
                "
                class="dashboard-card-task__icon fa-solid fa-eye ml-1"
                :class="{
                    'dashboard-cl-success': task.is_viewed,
                    'dashboard-cl-light': !task.is_viewed
                }"
            />
        </span>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';
import { useStore } from 'vuex';
import { dayjsFromMoscow, toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { isString } from '@/utils/helpers/string/isString.js';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const store = useStore();

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const expiredDayjs = computed(() => {
    if (isString(props.task.end)) return dayjsFromMoscow(props.task.end);
    return dayjs(props.task.end);
});
const isExpired = computed(() => expiredDayjs.value.diff(dayjs(), 'day') < 3 && !isCompleted.value);
const isForMe = computed(() => Number(props.task.user_id) === Number(store.getters.THIS_USER.id));

const expiredDate = computed(() => {
    return expiredDayjs.value.format('DD.MM.YYYY');
});

const viewedAt = computed(() => toBeautifulDateFormat(props.task.viewed_at));
</script>
