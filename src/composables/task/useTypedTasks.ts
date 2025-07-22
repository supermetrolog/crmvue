import { MaybeRefOrGetter } from '@vueuse/core';
import { Task, TaskStatusEnum, TaskTypeEnum } from '@/types/task';
import { computed, toValue } from 'vue';
import { toDateFormat } from '@/utils/formatters/date';

export interface UseTypedTasksOptions {
    withCompleted?: MaybeRefOrGetter<boolean>;
}

const excludedTypes = new Set([TaskTypeEnum.SCHEDULED_CALL, TaskTypeEnum.SCHEDULED_VISIT]);

export function useTypedTasks(tasks: MaybeRefOrGetter<Task[]>, options: UseTypedTasksOptions = {}) {
    const { withCompleted = false } = options;

    const scheduledCallTasks = computed(() => {
        const _withCompleted = toValue(withCompleted);

        return toValue(tasks).filter(
            task =>
                task.type === TaskTypeEnum.SCHEDULED_CALL &&
                (_withCompleted || task.status !== TaskStatusEnum.DONE)
        );
    });

    const scheduledVisitTasks = computed(() => {
        const _withCompleted = toValue(withCompleted);

        return toValue(tasks).filter(
            task =>
                task.type === TaskTypeEnum.SCHEDULED_VISIT &&
                (_withCompleted || task.status !== TaskStatusEnum.DONE)
        );
    });

    const baseTasks = computed(() => {
        const _withCompleted = toValue(withCompleted);

        return toValue(tasks).filter(
            task =>
                !excludedTypes.has(task.type) &&
                (_withCompleted || task.status !== TaskStatusEnum.DONE)
        );
    });

    const lastScheduledCallDate = computed(() => {
        if (scheduledCallTasks.value.length) {
            return toDateFormat(scheduledCallTasks.value[0].start, 'D.MM.YY в HH:mm');
        }

        return null;
    });

    const lastScheduledVisitDate = computed(() => {
        if (scheduledVisitTasks.value.length) {
            return toDateFormat(scheduledVisitTasks.value[0].start, 'D.MM.YY в HH:mm');
        }

        return null;
    });

    return {
        scheduledCallTasks,
        scheduledVisitTasks,
        lastScheduledCallDate,
        lastScheduledVisitDate,
        baseTasks
    };
}
