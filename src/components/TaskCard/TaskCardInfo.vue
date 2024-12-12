<template>
    <AccordionSimple>
        <template #title>
            <AccordionSimpleTriggerButton label="Дополнительная информация" />
        </template>
        <template #body>
            <div class="task-card__info mt-1">
                <TaskCardRow label="Создано">
                    {{ createdDate }}
                </TaskCardRow>
                <TaskCardRow label="Обновлено">
                    {{ updatedDate }}
                </TaskCardRow>
                <TaskCardRow v-if="isDeleted" label="Удалено">
                    {{ deletedDate }}
                </TaskCardRow>
                <TaskCardRow v-if="task.start" label="Исполнение с">
                    <span>{{ startDate }}</span>
                </TaskCardRow>
                <TaskCardRow label="Срок выполнения">
                    <span>{{ dayToExpired }} до {{ expiredDate }}</span>
                    <span v-if="isAlreadyExpired" class="error-message">
                        (просрочено на {{ dayToExpiredFromNow }})
                    </span>
                    <span v-else-if="!isCompleted"> (осталось {{ dayToExpiredFromNow }})</span>
                </TaskCardRow>
                <TaskCardRow v-if="isCanceled" label="Отложено">
                    до {{ impossibleDate }}
                </TaskCardRow>
                <TaskCardRow label="Автор">
                    <span v-if="task.is_system">Система</span>
                    <span v-else>
                        {{ task.created_by.userProfile.medium_name }}
                    </span>
                </TaskCardRow>
                <TaskCardRow label="Исполнитель">
                    <span v-if="task.user">
                        {{ task.user.userProfile.medium_name }}
                    </span>
                    <span v-else>-</span>
                </TaskCardRow>
            </div>
        </template>
    </AccordionSimple>
</template>

<script setup>
import { computed } from 'vue';
import TaskCardRow from '@/components/TaskCard/TaskCardRow.vue';
import dayjs from 'dayjs';
import plural from 'plural-ru';
import { taskOptions } from '@/const/options/task.options.js';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const isDeleted = computed(() => props.task.deleted_at !== null);
const isAlreadyExpired = computed(() => expiredDayjs.value.isBefore(dayjs()) && !isCompleted.value);
const isCanceled = computed(() => props.task.status === taskOptions.statusTypes.CANCELED);

const expiredDayjs = computed(() => dayjsFromMoscow(props.task.end));
const deletedDate = computed(() => toDateFormat(props.task.deleted_at, 'D MMMM YYYY, HH:mm'));
const createdDate = computed(() => toDateFormat(props.task.created_at, 'D MMMM YYYY, HH:mm'));
const updatedDate = computed(() => toDateFormat(props.task.updated_at, 'D MMMM YYYY, HH:mm'));

const expiredDate = computed(() => {
    if (expiredDayjs.value.isSame(dayjs(), 'year')) expiredDayjs.value.format('D MMMM');
    return expiredDayjs.value.format('D MMMM YYYY');
});

const startDate = computed(() => toDateFormat(props.task.start, 'D MMMM YYYY'));
const impossibleDate = computed(() => toDateFormat(props.task.impossible_to, 'D.MM.YY'));

const dayToExpired = computed(() => {
    const diff = Math.abs(
        expiredDayjs.value.diff(props.task.start ?? props.task.created_at, 'days')
    );

    if (diff === 0) return 'В течение дня';
    return plural(diff, '%d день', '%d дня', '%d дней');
});

const dayToExpiredFromNow = computed(() =>
    plural(Math.abs(expiredDayjs.value.diff(dayjs(), 'days')), '%d день', '%d дня', '%d дней')
);
</script>
