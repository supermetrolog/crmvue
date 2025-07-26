<template>
    <div class="dashboard-card-task-date">
        <Tippy v-if="!isCompleted">
            <span class="dashboard-card-task__date">{{ dateLabel }}</span>
            <template #content>
                <p class="text-grey">Сроки выполнения:</p>
                <p>C {{ startDate }} до {{ endDate }}</p>
            </template>
        </Tippy>
        <span>
            <UiTooltipIcon
                v-if="isStarted"
                icon="fa-solid fa-fire"
                tooltip="Дата старта уже прошла"
                class="dashboard-card-task__icon dashboard-cl-danger"
            />
            <UiTooltipIcon
                v-if="isCompleted"
                icon="fa-solid fa-check-circle"
                tooltip="Задача выполнена"
                class="dashboard-card-task__icon dashboard-cl-success"
            />
            <UiTooltipIcon
                v-if="isForMe"
                :tooltip="
                    task.is_viewed ? `Задача просмотрена ${viewedAt}` : 'Задача не просмотрена'
                "
                icon="fa-solid fa-eye"
                class="dashboard-card-task__icon ml-1"
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
import { dayjsFromServer, nowInServer, toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import { Tippy } from 'vue-tippy';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const store = useStore();

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);

const expiredDayjs = computed(() => {
    if (isString(props.task.end)) return dayjsFromServer(props.task.end);
    return dayjs(props.task.end);
});

const startDayjs = computed(() => {
    if (isString(props.task.start)) return dayjsFromServer(props.task.start);
    return dayjs(props.task.start);
});

const endDate = computed(() => expiredDayjs.value.format('D.MM.YY'));
const startDate = computed(() => startDayjs.value.format('D.MM.YY, HH:mm'));

const isForMe = computed(() => Number(props.task.user_id) === Number(store.getters.THIS_USER.id));

const isStarted = computed(() => startDayjs.value.isBefore(nowInServer()));

const dateLabel = computed(() => {
    if (isStarted.value) return `до ${endDate.value}`;
    return `от ${startDate.value}`;
});

const viewedAt = computed(() => toBeautifulDateFormat(props.task.viewed_at));
</script>
