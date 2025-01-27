<template>
    <div class="task-card__header">
        <div class="task-card__actions">
            <UiButtonIcon
                @click="$emit('toggle-favorite')"
                :class="isFavorite ? 'fa-solid' : 'fa-regular'"
                :label="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
                :active="isFavorite"
                class="fa-star"
            >
            </UiButtonIcon>
            <UiButtonIcon
                v-if="viewable"
                @click="$emit('read')"
                label="Отметить прочитанным"
                icon="fa-solid fa-user-check"
            />
            <UiButtonIcon
                v-if="task.related_by"
                @click="$emit('to-chat')"
                label="Перейти в чат"
                icon="fa-solid fa-comment-alt"
            />
            <template v-if="!isDeleted">
                <div v-if="draggable && canBeDragged" class="dashboard-card-task__moves">
                    <UiButtonIcon
                        @click.stop="$emit('change-status')"
                        label="Изменить статус"
                        :disabled
                        icon="fa-solid fa-arrow-right-arrow-left"
                    />
                </div>
                <div v-if="canBeSuspend" class="dashboard-card-task__moves">
                    <UiButtonIcon
                        @click.stop="$emit('to-impossible')"
                        label="Отложить"
                        :disabled
                        icon="fa-solid fa-eye-slash"
                    />
                </div>
                <UiButtonIcon
                    v-if="canBeAssigned"
                    @click="$emit('assign')"
                    label="Переназначить"
                    :disabled
                    icon="fa-solid fa-user-tag"
                />
            </template>
            <UiButtonIcon
                v-if="editable && canBeEdit"
                @click="$emit('edit')"
                label="Редактировать"
                :disabled
                icon="fa-solid fa-pen"
            />
            <UiButtonIcon
                v-if="isDeleted && canBeRestored"
                @click="$emit('restore')"
                label="Восстановить"
                :disabled
                icon="fa-solid fa-trash-restore"
            />
            <UiButtonIcon
                v-else-if="canBeDeleted"
                @click="$emit('delete')"
                label="Удалить"
                :disabled
                icon="fa-solid fa-trash"
            />
        </div>
        <TaskCardHeaderTargets :task />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { taskOptions } from '@/const/options/task.options.js';
import { useStore } from 'vuex';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import TaskCardHeaderTargets from '@/components/TaskCard/TaskCardHeaderTargets.vue';
import { useFavoriteTasks } from '@/composables/useFavoriteTasks.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

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

const { isFavoriteTask } = useFavoriteTasks();

const isFavorite = computed(() => isFavoriteTask(props.task.id));

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
</script>
