import { MaybeRefOrGetter } from '@vueuse/core';
import { Task } from '@/types/task';
import { computed, toValue } from 'vue';
import { useAuth } from '@/composables/useAuth';
import dayjs from 'dayjs';
import { dayjsFromServer } from '@/utils/formatters/date';
import { taskOptions } from '@/const/options/task.options';

export function useTaskPermissions(task: MaybeRefOrGetter<Task>) {
    const { currentUserIsModeratorOrHigher, currentUserId } = useAuth();

    const isRecent = computed(
        () => dayjs().diff(dayjsFromServer(toValue(task).created_at), 'minute') < 20
    );

    const isCompleted = computed(() => toValue(task).status === taskOptions.statusTypes.COMPLETED);
    const isDeleted = computed(() => toValue(task).deleted_at !== null);

    const canBeDeleted = computed(() => () => {
        if (currentUserIsModeratorOrHigher.value) return true;

        return currentUserId.value === Number(toValue(task).created_by_id) && isRecent.value;
    });

    const canBeEdit = computed(
        () =>
            currentUserIsModeratorOrHigher.value ||
            Number(toValue(task).created_by_id) === currentUserId.value
    );

    const canBeDragged = computed(
        () => canBeEdit.value || toValue(task).user_id === currentUserId.value
    );

    const canBePostponed = computed(() => {
        const tsk = toValue(task);

        return (
            !isCompleted.value &&
            (Number(tsk.created_by_id) === currentUserId.value ||
                tsk.user_id === currentUserId.value ||
                currentUserIsModeratorOrHigher.value)
        );
    });

    const canBeRestored = computed(() => currentUserIsModeratorOrHigher.value);

    const canBeAssigned = computed(() => {
        const tsk = toValue(task);

        return (
            currentUserIsModeratorOrHigher.value ||
            Number(tsk.created_by_id) === currentUserId.value ||
            tsk.user_id === currentUserId.value
        );
    });

    const canBeCompleted = computed(
        () => canBeDragged.value && !isCompleted.value && !isDeleted.value
    );

    return {
        isDeleted,
        isCompleted,
        canBeEdit,
        canBeDeleted,
        canBeDragged,
        canBePostponed,
        canBeRestored,
        canBeAssigned,
        canBeCompleted
    };
}
