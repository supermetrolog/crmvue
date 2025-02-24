<template>
    <div
        class="task-card__header"
        :class="{
            'task-card__header--completed': isCompleted,
            'task-card__header--canceled': isCanceled,
            'task-card__header--expired': isExpired,
            'task-card__header--already-expired': isAlreadyExpired
        }"
    >
        <div class="task-card__chips">
            <DashboardChip class="task-card__chip"> Задача #{{ task.id }} </DashboardChip>
            <DashboardChip class="task-card__chip" with-icon>
                <i class="fa-regular fa-clock"></i>
                <span>до {{ endDate }}</span>
            </DashboardChip>
            <DashboardChip class="task-card__chip task-card__status">
                <i :class="statusIcon" />
                <span>{{ status }}</span>
                <span v-if="isCanceled">до {{ impossibleDate }}</span>
            </DashboardChip>
        </div>
        <div class="task-card__actions">
            <UiDropdownActions menu-class="task-card__dropdown">
                <template #trigger>
                    <UiButtonIcon label="Действия над задачей" :disabled icon="fa-solid fa-pen" />
                </template>
                <template #menu>
                    <UiDropdownActionsButton
                        v-if="editable && canBeEdit"
                        @handle="$emit('edit')"
                        icon="fa-solid fa-pen"
                        label="Редактировать"
                        :disabled
                    />
                    <UiDropdownActionsButton
                        v-if="!isDeleted && draggable && canBeDragged"
                        @handle="$emit('change-status')"
                        icon="fa-solid fa-arrow-right-arrow-left"
                        label="Изменить статус"
                        :disabled
                    />
                    <UiDropdownActionsButton
                        @handle="toggleFavoriteTask(task.id)"
                        :icon="isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                        :label="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
                        :disabled
                        :active="isFavorite"
                        :close-on-click="false"
                        :loading="isLoading"
                    />
                    <UiDropdownActionsButton
                        v-if="viewable"
                        @handle="$emit('read')"
                        icon="fa-solid fa-user-check"
                        label="Отметить прочитанным"
                    />
                    <template v-if="!isDeleted">
                        <UiDropdownActionsButton
                            v-if="canBeSuspend"
                            @handle="$emit('to-impossible')"
                            icon="fa-solid fa-eye-slash"
                            label="Отложить"
                            :disabled
                        />
                        <UiDropdownActionsButton
                            v-if="canBeAssigned"
                            @handle="$emit('assign')"
                            icon="fa-solid fa-user-tag"
                            label="Переназначить"
                            :disabled
                        />
                    </template>
                    <UiDropdownActionsButton
                        v-if="task.related_by"
                        @handle="$emit('to-chat')"
                        label="Перейти в чат"
                        icon="fa-solid fa-comment-alt"
                    />
                    <UiDropdownActionsButton
                        v-if="isDeleted && canBeRestored"
                        @handle="$emit('restore')"
                        icon="fa-solid fa-trash-restore"
                        label="Восстановить"
                        :disabled
                    />
                    <UiDropdownActionsButton
                        v-else-if="canBeDeleted"
                        @handle="$emit('delete')"
                        icon="fa-solid fa-trash"
                        label="Удалить"
                        :disabled
                    />
                </template>
            </UiDropdownActions>
        </div>
        <TaskCardHeaderTargets :task />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { taskOptions } from '@/const/options/task.options.js';
import { useStore } from 'vuex';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import TaskCardHeaderTargets from '@/components/TaskCard/TaskCardHeaderTargets.vue';
import { useFavoriteTasks } from '@/composables/useFavoriteTasks.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';

defineEmits([
    'to-chat',
    'read',
    'change-status',
    'to-impossible',
    'assign',
    'delete',
    'restore',
    'edit',
    'toggle-favorite'
]);

const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    },
    viewable: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const store = useStore();
const { currentUserId, currentUserIsModerator } = useAuth();

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const isDeleted = computed(() => props.task.deleted_at !== null);
const isCanceled = computed(() => props.task.status === taskOptions.statusTypes.CANCELED);

const isRecent = computed(
    () => dayjs().diff(dayjsFromMoscow(props.task.created_at), 'minute') < 20
);

// favorites

const { isFavoriteTask, toggleFavoriteTask, isLoading } = useFavoriteTasks();

const isFavorite = computed(() => isFavoriteTask(props.task.id));

// permissions

const canBeDeleted = computed(() => () => {
    if (currentUserIsModerator.value) return true;

    return currentUserId.value === props.task.created_by_id && isRecent.value;
});

const canBeEdit = computed(
    () => currentUserIsModerator.value || props.task.created_by_id === currentUserId.value
);

const canBeDragged = computed(() => canBeEdit.value || props.task.user_id === currentUserId.value);

const canBeSuspend = computed(() => {
    return (
        !isCanceled.value &&
        !isCompleted.value &&
        (props.task.created_by_id === currentUserId.value ||
            props.task.user_id === currentUserId.value ||
            currentUserIsModerator.value)
    );
});

const canBeRestored = computed(() => store.getters.isModerator);

const canBeAssigned = computed(() => {
    return (
        store.getters.isModerator ||
        props.task.created_by_id === currentUserId.value ||
        props.task.user_id === currentUserId.value
    );
});

const isAlreadyExpired = computed(() => expiredDayjs.value.isBefore(dayjs()) && !isCompleted.value);
const isExpired = computed(() => expiredDayjs.value.diff(dayjs(), 'day') < 3 && !isCompleted.value);

const expiredDayjs = computed(() => dayjsFromMoscow(props.task.end));
const impossibleDate = computed(() => toDateFormat(props.task.impossible_to, 'D.MM.YY'));

const status = computed(() => taskOptions.status[props.task.status]);
const statusIcon = computed(() => taskOptions.statusIcon[props.task.status]);

const endDate = computed(() => toDateFormat(props.task.end, 'D.MM.YY'));
</script>
