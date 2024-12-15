<template>
    <div class="task-card__header">
        <div class="task-card__actions">
            <HoverActionsButton v-if="viewable" @click="$emit('read')" label="Отметить прочитанным">
                <i class="fa-solid fa-user-check"></i>
            </HoverActionsButton>
            <HoverActionsButton
                v-if="task.related_by"
                @click="$emit('to-chat')"
                label="Перейти в чат"
            >
                <i class="fa-solid fa-comment-alt" />
            </HoverActionsButton>
            <template v-if="!isDeleted">
                <div v-if="draggable && canBeDragged" class="dashboard-card-task__moves">
                    <HoverActionsButton
                        @click.stop="$emit('change-status')"
                        label="Изменить статус"
                        :disabled
                    >
                        <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    </HoverActionsButton>
                </div>
                <div v-if="canBeSuspend" class="dashboard-card-task__moves">
                    <HoverActionsButton
                        @click.stop="$emit('to-impossible')"
                        label="Отложить"
                        :disabled
                    >
                        <i class="fa-solid fa-eye-slash"></i>
                    </HoverActionsButton>
                </div>
                <HoverActionsButton
                    v-if="canBeAssigned"
                    @click="$emit('assign')"
                    label="Переназначить"
                    :disabled
                >
                    <i class="fa-solid fa-user-tag"></i>
                </HoverActionsButton>
            </template>
            <HoverActionsButton
                v-if="editable && canBeEdit"
                @click="$emit('edit')"
                label="Редактировать"
                :disabled
            >
                <i class="fa-solid fa-pen" />
            </HoverActionsButton>
            <HoverActionsButton
                v-if="isDeleted && canBeRestored"
                @click="$emit('restore')"
                label="Восстановить"
                :disabled
            >
                <i class="fa-solid fa-trash-restore" />
            </HoverActionsButton>
            <HoverActionsButton
                v-else-if="canBeDeleted"
                @click="$emit('delete')"
                label="Удалить"
                :disabled="disabled"
            >
                <i class="fa-solid fa-trash" />
            </HoverActionsButton>
        </div>
        <TaskCardHeaderTargets :task />
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { taskOptions } from '@/const/options/task.options.js';
import { useStore } from 'vuex';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import TaskCardHeaderTargets from '@/components/TaskCard/TaskCardHeaderTargets.vue';

defineEmits([
    'to-chat',
    'read',
    'change-status',
    'to-impossible',
    'assign',
    'delete',
    'restore',
    'edit'
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
