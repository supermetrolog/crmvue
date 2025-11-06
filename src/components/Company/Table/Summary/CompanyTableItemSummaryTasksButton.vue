<template>
    <UiDropdownActions
        align="left"
        :disabled="(!hasCurrentUserScheduledCall && tasks.length === 1) || isDisabled"
        :title="dropdownTitle"
    >
        <template #trigger>
            <UiButton
                @click="onClick"
                :state="completeButtonState"
                :loading="isDeleting || isRestoring"
                class="fs-2 company-table-item-summary-survey__tab"
                color="white"
                small
                :class="{
                    danger: lastScheduledCallDateExpired,
                    primary: !lastScheduledCallDateExpired,
                    'op-5': !hasCurrentUserScheduledCall,
                    'text-through op-5': isDeleted
                }"
            >
                <span>{{ label }} {{ nearestScheduledCallDate }}</span>
                <span v-if="tasks.length > 1" class="ml-1"> (+ еще {{ tasks.length - 1 }}) </span>
            </UiButton>
        </template>
        <template #menu>
            <UiDropdownActionsGroup v-if="hasCurrentUserScheduledCall">
                <UiDropdownActionsButton
                    v-if="canBeCompleted"
                    @handle="completeTask(nearestTask)"
                    :loading="isCompleting"
                    icon="fa-solid fa-check text-success"
                    label="Отметить выполненным"
                />
                <UiDropdownActionsButton
                    v-if="canBeEdit && !isDeleted"
                    @handle="changeDatesFormIsVisible = true"
                    label="Изменить сроки"
                    icon="fa-regular fa-clock text-primary"
                />
                <UiDropdownActionsButton
                    v-if="isDeleted && canBeRestored"
                    @handle="restoreTask(nearestTask)"
                    label="Восстановить"
                    icon="fa-solid fa-undo"
                />
                <UiDropdownActionsButton
                    v-else-if="!isDeleted && canBeDeleted"
                    @handle="deleteTask(nearestTask)"
                    :loading="isDeleting"
                    label="Удалить"
                    icon="fa-solid fa-trash color-danger"
                />
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('show', nearestTask)"
                    label="Подробнее о задаче"
                    icon="fa-solid fa-ellipsis"
                    class="op-7"
                />
                <UiDropdownActionsButton
                    v-if="tasks.length > 1"
                    @handle="$emit('show-all')"
                    :label="`Все задачи (${tasks.length})`"
                    icon="fa-solid fa-ellipsis"
                    class="op-7"
                />
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
    <AnimationTransition :speed="0.3">
        <TaskCardModalChangeDates
            v-if="changeDatesFormIsVisible"
            @confirm="changeDates(nearestTask, $event)"
            @close="changeDatesFormIsVisible = false"
            :loading="datesIsChanging"
            :start-date="nearestTask.start"
            :end-date="nearestTask.end"
            :lock-scroll="false"
            title="Изменение сроков задачи"
            :z-index="7"
        />
    </AnimationTransition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date';
import { now, useEventBus } from '@vueuse/core';
import { Task } from '@/types/task';
import { useAuth } from '@/composables/useAuth';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { useTaskPermissions } from '@/composables/useTaskPermissions';
import api from '@/api/api';
import { taskOptions } from '@/const/options/task.options';
import { useNotify } from '@/utils/use/useNotify';
import { TASK_EVENTS } from '@/const/events/task';
import { useAsync } from '@/composables/useAsync';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import TaskCardModalChangeDates from '@/components/TaskCard/TaskCardModalChangeDates.vue';
import { useSurveySuggestion } from '@/composables/useSurveySuggestion';

const emit = defineEmits<{
    (e: 'show', task: Task): void;
    (e: 'show-all'): void;
    (e: 'updated', task: Task): void;
}>();

const props = defineProps<{
    tasks: Task[];
    nearestTask: Task;
    label: string;
}>();

const lastScheduledCallDateExpired = computed(() =>
    dayjsFromServer(props.nearestTask.start).isBefore(now(), 'day')
);

const nearestScheduledCallDate = computed(() =>
    toDateFormat(props.nearestTask!.start, 'D.MM.YY в HH:mm')
);

const { currentUserId } = useAuth();

const hasCurrentUserScheduledCall = computed(
    () => props.nearestTask.user_id === currentUserId.value
);

const dropdownTitle = computed(() => {
    if (!hasCurrentUserScheduledCall.value) {
        return '';
    }

    return `${props.label} ${nearestScheduledCallDate.value}`;
});

const { canBeEdit, canBeDeleted, canBeRestored, isDeleted, canBeCompleted } = useTaskPermissions(
    () => props.nearestTask
);

function onClick() {
    if (!hasCurrentUserScheduledCall.value && props.tasks.length === 1) {
        emit('show', props.tasks[0]);
    }
}

const { suggestSurveyByTask } = useSurveySuggestion();

const notify = useNotify();

const taskCompleteEvent = useEventBus(TASK_EVENTS.COMPLETE);

const {
    execute: completeTask,
    buttonState: completeButtonState,
    isLoading: isCompleting
} = useAsync(
    (task: Task) => api.task.changeStatus(task.id, taskOptions.clearStatusTypes.COMPLETED),
    {
        async onFetchResponse({ args }) {
            notify.success('Статус задачи успешно изменен');

            if (args[0].user_id === currentUserId.value) {
                taskCompleteEvent.emit();
            }

            const updatedTask = await api.task.getOne(args[0].id);

            if (updatedTask) {
                void suggestSurveyByTask(updatedTask);
                emit('updated', updatedTask);
            }
        }
    }
);

const { execute: deleteTask, isLoading: isDeleting } = useAsync(
    (task: Task) => api.task.delete(task.id),
    {
        async onFetchResponse({ args }) {
            notify.info('Задача успешно удалена');

            const updatedTask = await api.task.getOne(args[0].id);

            if (updatedTask) {
                emit('updated', updatedTask);
            }
        },
        confirmation: true,
        confirmationContent: {
            title: 'Удалить задачу',
            message: 'Вы уверены, что хотите удалить задачу? Удаленную задачу нельзя восстановить',
            okButton: 'Удалить',
            okIcon: 'fa-solid fa-trash'
        }
    }
);

const { execute: restoreTask, isLoading: isRestoring } = useAsync(
    (task: Task) => api.task.restore(task.id),
    {
        async onFetchResponse({ response, args }) {
            if (response) {
                notify.info('Задача успешно восстановлена', 'Восстановление задачи');

                const updatedTask = await api.task.getOne(args[0].id);

                if (updatedTask) {
                    emit('updated', updatedTask);
                }
            }
        },
        confirmation: true,
        confirmationContent: {
            title: 'Восстановить задачу',
            message: 'Вы уверены, что хотите восстановить задачу?',
            okButton: 'Восстановить'
        }
    }
);

const changeDatesFormIsVisible = ref(false);
const datesIsChanging = ref(false);

const changeDatesEventBus = useEventBus(TASK_EVENTS.CHANGE_DATES);

async function changeDates(task: Task, payload: object) {
    datesIsChanging.value = true;

    try {
        const response = await api.task.changeDates(task.id, payload);

        notify.success(`Даты задачи успешно изменены`);

        changeDatesFormIsVisible.value = false;
        changeDatesEventBus.emit({ task: response });

        emit('updated', response);
    } finally {
        datesIsChanging.value = false;
    }
}

const isDisabled = computed(
    () => isCompleting.value || isDeleting.value || isRestoring.value || datesIsChanging.value
);
</script>
