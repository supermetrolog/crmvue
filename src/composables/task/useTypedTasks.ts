import { MaybeRefOrGetter } from '@vueuse/core';
import { Task, TaskStatusEnum, TaskType, TaskTypeEnum } from '@/types/task';
import { computed, toValue } from 'vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date';

export interface UseTypedTasksOptions {
    withCompleted?: MaybeRefOrGetter<boolean>;
}

const excludedTypes = new Set<TaskType>([
    TaskTypeEnum.SCHEDULED_CALL,
    TaskTypeEnum.SCHEDULED_VISIT
]);

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

    const nearestScheduledCall = computed(() => {
        if (scheduledCallTasks.value.length === 0) return null;

        return scheduledCallTasks.value.reduce((prev, task) => {
            if (dayjsFromServer(prev.start).isBefore(dayjsFromServer(task.start))) return prev;
            return task;
        }, scheduledCallTasks.value[0]);
    });

    const scheduledVisitTasks = computed(() => {
        const _withCompleted = toValue(withCompleted);

        return toValue(tasks).filter(
            task =>
                task.type === TaskTypeEnum.SCHEDULED_VISIT &&
                (_withCompleted || task.status !== TaskStatusEnum.DONE)
        );
    });

    const nearestScheduledVisit = computed(() => {
        if (scheduledVisitTasks.value.length === 0) return null;

        return scheduledVisitTasks.value.reduce((prev, task) => {
            if (dayjsFromServer(prev.start).isBefore(dayjsFromServer(task.start))) return prev;
            return task;
        }, scheduledVisitTasks.value[0]);
    });

    const baseTasks = computed(() => {
        const _withCompleted = toValue(withCompleted);

        return toValue(tasks).filter(
            task =>
                !excludedTypes.has(task.type) &&
                (_withCompleted || task.status !== TaskStatusEnum.DONE)
        );
    });

    const nearestScheduledCallDate = computed(() => {
        if (scheduledCallTasks.value.length === 0) return null;

        return toDateFormat(nearestScheduledCall.value!.start, 'D.MM.YY в HH:mm');
    });

    const nearestScheduledVisitDate = computed(() => {
        if (scheduledVisitTasks.value.length === 0) return null;

        return toDateFormat(nearestScheduledVisit.value!.start, 'D.MM.YY в HH:mm');
    });

    return {
        scheduledCallTasks,
        scheduledVisitTasks,
        nearestScheduledCallDate,
        nearestScheduledCall,
        nearestScheduledVisitDate,
        nearestScheduledVisit,
        baseTasks
    };
}
