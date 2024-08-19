<template>
    <div>
        <teleport to="body">
            <FormModalTask ref="taskForm" />
        </teleport>
    </div>
    <div v-if="visible" class="dashboard-task-item-preview">
        <div class="dashboard-task-item-preview__actions">
            <div v-if="draggable" class="dashboard-card-task__moves">
                <HoverActionsButton
                    @click.stop="moveSettingsIsVisible = !moveSettingsIsVisible"
                    label="Изменить статус"
                >
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </HoverActionsButton>
                <DashboardTableTasksItemPreviewStatus
                    v-if="moveSettingsIsVisible"
                    @toggle="toggleStatus"
                    :status="task.status"
                />
            </div>
            <HoverActionsButton @click="$emit('to-chat')" label="Перейти в чат">
                <i class="fa-solid fa-comment-alt" />
            </HoverActionsButton>
            <template v-if="editable">
                <HoverActionsButton @click="editTask" label="Редактировать">
                    <i class="fa-solid fa-pen" />
                </HoverActionsButton>
                <HoverActionsButton @click="deleteTask" :disabled="isDeleted" label="Удалить">
                    <i class="fa-solid fa-trash" />
                </HoverActionsButton>
            </template>
        </div>
        <div class="dashboard-task-item-preview__description">
            <div class="dashboard-task-item-preview__chips">
                <DashboardChip class="dashboard-task-item-preview__chip">
                    Задача #{{ task.id }}
                </DashboardChip>
                <DashboardChip
                    v-if="isCompleted"
                    class="dashboard-task-item-preview__chip dashboard-cl-success"
                >
                    Выполнено
                </DashboardChip>
                <DashboardChip
                    v-else-if="isAlreadyExpired"
                    class="dashboard-task-item-preview__chip dashboard-cl-danger"
                >
                    Просрочено
                </DashboardChip>
            </div>
            <p class="dashboard-task-item-preview__label my-1">Описание задачи:</p>
            <div class="dashboard-task-item-preview__message">
                <p>{{ task.message }}</p>
            </div>
        </div>
        <div class="dashboard-task-item-preview__info">
            <DashboardTableTasksItemPreviewRow label="Создано">
                {{ createdDate }}
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Обновлено">
                {{ updatedDate }}
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow v-if="isDeleted" label="Удалено">
                {{ deletedDate }}
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Исполнение с">
                {{ startDate }}
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Срок выполнения">
                <span>{{ dayToExpired }} до {{ expiredDate }}</span>
                <span v-if="isAlreadyExpired" class="error-message">
                    (просрочено на {{ dayToExpiredFromNow }})
                </span>
                <span v-else-if="!isCompleted"> (осталось {{ dayToExpiredFromNow }})</span>
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Автор">
                <span v-if="task.created_by_type === 'user'">
                    {{ task.created_by.userProfile.medium_name }}
                </span>
                <span v-else>Система</span>
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Ответственный">
                <span v-if="task.user">
                    {{ task.user.userProfile.medium_name }}
                </span>
                <span v-else>-</span>
            </DashboardTableTasksItemPreviewRow>
            <DashboardTableTasksItemPreviewRow label="Наблюдатели">
                -
            </DashboardTableTasksItemPreviewRow>
        </div>
        <div v-if="task.relation" class="dashboard-task-item-preview__relation mb-2">
            <p class="dashboard-task-item-preview__label mb-1">По чату в задачнике:</p>
            <component
                :is="currentDialogComponent"
                @click="$emit('to-chat')"
                :model="task.relation.model"
            />
        </div>
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardTableTasksItemPreviewStatus from '@/components/Dashboard/Table/DashboardTableTasksItemPreviewStatus.vue';
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import DashboardTableTasksItemPreviewRow from '@/components/Dashboard/Table/DashboardTableTasksItemPreviewRow.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import plural from 'plural-ru';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/MessengerDialogObject.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';

const emit = defineEmits(['updated', 'to-chat']);
const props = defineProps({
    task: {
        type: [Object, null],
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
    visible: {
        type: Boolean,
        default: false
    }
});

const notify = useNotify();
const { confirm } = useConfirm();

const moveSettingsIsVisible = shallowRef(false);
const taskForm = shallowRef(null);

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const isDeleted = computed(() => props.task.deleted_at !== null);
const isAlreadyExpired = computed(() => expiredDayjs.value.isBefore(dayjs()) && !isCompleted.value);

const expiredDayjs = computed(() => dayjs(props.task.end));
const deletedDate = computed(() => dayjs(props.task.deleted_at).format('D MMMM YYYY, HH:mm'));
const createdDate = computed(() => dayjs(props.task.created_at).format('D MMMM YYYY, HH:mm'));
const updatedDate = computed(() => dayjs(props.task.updated_at).format('D MMMM YYYY, HH:mm'));
const expiredDate = computed(() => {
    if (expiredDayjs.value.isSame(dayjs(), 'year')) expiredDayjs.value.format('D MMMM');
    return expiredDayjs.value.format('D MMMM YYYY');
});
const startDate = computed(() => dayjs(props.task.start).format('D MMMM YYYY'));
const dayToExpired = computed(() => {
    return plural(
        Math.abs(expiredDayjs.value.diff(props.task.start, 'days')),
        '%d день',
        '%d дня',
        '%d дней'
    );
});
const dayToExpiredFromNow = computed(() =>
    plural(Math.abs(expiredDayjs.value.diff(dayjs(), 'days')), '%d день', '%d дня', '%d дней')
);

const moveClickHandler = () => {
    moveSettingsIsVisible.value = false;
};

const editTask = async () => {
    const taskPayload = await taskForm.value.open(props.task);
    if (!taskPayload) return;

    const task = await api.task.update(props.task.id, { ...props.task, ...taskPayload });
    if (task) {
        emit('updated', task);
        notify.success('Задача успешно обновлена');
    }
};

const deleteTask = async () => {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить задачу?');
    if (!confirmed) return;

    const deleted = await api.task.delete(props.task.id);
    if (deleted) {
        emit('updated', { ...props.task, deleted_at: new Date() });
        notify.info('Задача успешно удалена');
    }
};

const toggleStatus = async status => {
    const newTask = await api.task.update(props.task.id, { ...props.task, status });
    if (newTask) {
        emit('updated', newTask);
        notify.success('Статус задачи успешно изменен');
    }
};

const currentDialogComponent = computed(() => {
    if (props.task.relation.model_type === 'request') return MessengerDialogRequest;
    return MessengerDialogObject;
});

watch(moveSettingsIsVisible, value => {
    if (value) document.addEventListener('click', moveClickHandler);
    else document.removeEventListener('click', moveClickHandler);
});

onBeforeUnmount(() => {
    if (moveSettingsIsVisible.value) document.removeEventListener('click', moveClickHandler);
});
</script>
