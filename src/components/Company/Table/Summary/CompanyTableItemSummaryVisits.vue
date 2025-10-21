<template>
    <UiDropdownActions align="left" :disabled="!hasCurrentUserScheduledCall" :title="dropdownTitle">
        <template #trigger>
            <UiButton
                @click="onClick"
                class="fs-2 company-table-item-summary-survey__tab"
                color="white"
                small
                :class="{
                    danger: lastScheduledCallDateExpired,
                    primary: !lastScheduledCallDateExpired,
                    'op-5': !hasCurrentUserScheduledCall
                }"
            >
                <span>Звонок {{ nearestScheduledCallDate }}</span>
                <span v-if="tasks.length > 1" class="ml-1"> (+ еще {{ tasks.length - 1 }}) </span>
            </UiButton>
        </template>
        <template #menu>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    v-if="canBeCompleted"
                    @handle="$emit('complete', nearestTask.id)"
                    icon="fa-solid fa-check text-success"
                    label="Отметить выполненным"
                />
                <UiDropdownActionsButton
                    v-if="canBeEdit"
                    @handle="$emit('change-date', nearestTask.id)"
                    label="Изменить сроки"
                    icon="fa-regular fa-clock text-primary"
                />
                <UiDropdownActionsButton
                    v-if="isDeleted && canBeRestored"
                    @handle="$emit('restore', nearestTask.id)"
                    label="Восстановить"
                    icon="fa-solid fa-trash"
                />
                <UiDropdownActionsButton
                    v-else-if="!isDeleted && canBeDeleted"
                    @handle="$emit('delete', nearestTask.id)"
                    label="Удалить"
                    icon="fa-solid fa-trash color-danger"
                />
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('show', nearestTask)"
                    label="Подробнее о звонке"
                    icon="fa-solid fa-ellipsis"
                    class="op-7"
                />
                <UiDropdownActionsButton
                    v-if="tasks.length > 1"
                    @handle="$emit('show-all')"
                    :label="`Все звонки (${tasks.length})`"
                    icon="fa-solid fa-ellipsis"
                    class="op-7"
                />
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date';
import { now } from '@vueuse/core';
import { Task } from '@/types/task';
import { useAuth } from '@/composables/useAuth';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { useTaskPermissions } from '@/composables/useTaskPermissions';

const emit = defineEmits<{
    (e: 'show', task: Task): void;
    (e: 'show-all'): void;
    (e: 'complete', taskId: number): void;
    (e: 'delete', taskId: number): void;
    (e: 'restore', taskId: number): void;
    (e: 'change-date', taskId: number): void;
}>();

const props = defineProps<{
    tasks: Task[];
    nearestTask: Task;
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

    return `Звонок ${nearestScheduledCallDate.value}`;
});

const { canBeEdit, canBeDeleted, canBeRestored, isDeleted, canBeCompleted } = useTaskPermissions(
    () => props.nearestTask
);

function onClick() {
    if (!hasCurrentUserScheduledCall.value) {
        emit('show');
    }
}
</script>
