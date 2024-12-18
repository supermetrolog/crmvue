<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="tasks.new.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'new')"
                    @add="changeTaskStatus($event, 'new')"
                    :pagination="tasks.new.pagination"
                    :is-loading="isLoading"
                    title="Новые"
                >
                    <template #icon>
                        <DashboardRoundedIcon
                            icon="fa-solid fa-list-ul"
                            class="dashboard-bg-primary-l"
                        />
                    </template>
                </DashboardKanbanBoard>
            </div>
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="tasks.inProgress.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'inProgress')"
                    @add="changeTaskStatus($event, 'in_Progress')"
                    :pagination="tasks.inProgress.pagination"
                    :is-loading="isLoading"
                    title="В процессе"
                >
                    <template #icon>
                        <DashboardRoundedIcon
                            icon="fa-regular fa-hourglass-half"
                            class="dashboard-bg-warning-l"
                        />
                    </template>
                </DashboardKanbanBoard>
            </div>
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="tasks.completed.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'completed')"
                    @add="changeTaskStatus($event, 'completed')"
                    :pagination="tasks.completed.pagination"
                    :is-loading="isLoading"
                    title="Выполнено"
                >
                    <template #icon>
                        <DashboardRoundedIcon
                            icon="fa-regular fa-circle-check"
                            class="dashboard-bg-success-l"
                        />
                    </template>
                </DashboardKanbanBoard>
            </div>
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="tasks.canceled.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'canceled')"
                    @add="changeTaskStatus($event, 'canceled')"
                    :pagination="tasks.canceled.pagination"
                    :is-loading="isLoading"
                    title="Приостановлено"
                >
                    <template #icon>
                        <DashboardRoundedIcon
                            icon="fa-regular fa-circle-pause"
                            class="dashboard-bg-danger-l"
                        />
                    </template>
                </DashboardKanbanBoard>
            </div>
        </div>
    </div>
</template>
<script setup>
import DashboardKanbanBoard from '@/components/Dashboard/Kanban/DashboardKanbanBoard.vue';
import api from '@/api/api.js';
import DashboardRoundedIcon from '@/components/Dashboard/DashboardRoundedIcon.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, inject, reactive, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useStore } from 'vuex';
import { taskOptions } from '@/const/options/task.options.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

const $targetUser = inject('$targetUser');
const { confirm } = useConfirm();
const notify = useNotify();
const { isLoading } = useDelayedLoader();
const store = useStore();
const { show: showTaskCreator } = useAsyncPopup('taskCreator');

const tasks = reactive({
    new: {
        data: [],
        pagination: null
    },
    inProgress: {
        data: [],
        pagination: null
    },
    completed: {
        data: [],
        pagination: null
    },
    canceled: {
        data: [],
        pagination: null
    }
});

const targetUser = computed(() => $targetUser);

watch(
    () => targetUser.value,
    () => {
        fetchTasks();
    }
);

const fetchTasks = async () => {
    isLoading.value = true;

    const response = await store.dispatch('Task/getTasks', targetUser.value?.id);

    if (response) {
        tasks.new = response[0];
        tasks.inProgress = response[1];
        tasks.completed = response[2];
        tasks.canceled = response[3];
    }

    isLoading.value = false;
};
const loadTasks = async ($state, statusName) => {
    const { currentPage, pageCount } = tasks[statusName].pagination;

    if (pageCount === 0 || currentPage === pageCount) {
        $state.complete();
        return;
    }

    const statusID = taskOptions.statusTypes[statusName];
    const page = currentPage + 1;

    const response = await api.task.get({ status: statusID, page, deleted: 0 });

    if (response) {
        tasks[statusName].pagination = response.pagination;
        tasks[statusName].data.push(...response.data);

        if (response.pagination.currentPage === response.pagination.pageCount) $state.complete();
        else $state.loaded();
    }
};
const changeTaskStatus = async (task, statusName) => {
    task.isUpdating = true;

    const status = taskOptions.statusTypes[statusName.toUpperCase()];
    const updatedTask = await api.task.changeStatus(task.id, status);

    const prevArrayName = taskOptions.statusNames[task.status].replaceAll('_', '');
    const tasksArrayName = statusName.replaceAll('_', '');

    if (updatedTask) {
        task.status = status;
        tasks[prevArrayName].pagination.totalCount--;
        tasks[tasksArrayName].pagination.totalCount++;

        notify.success('Статус задачи успешно изменен');
    } else {
        tasks[prevArrayName].data.unshift(task);
        tasks[tasksArrayName].data.splice(
            tasks[tasksArrayName].data.findIndex(element => element.id === task.id),
            1
        );
        notify.error('Произошла ошибка. Попробуйте позже');
    }

    task.isUpdating = false;
};
const deleteTask = async task => {
    const confirmed = await confirm('Вы уверены, что хотите удалить задачу?');

    if (confirmed) {
        const deleted = await api.task.delete(task.id);

        if (deleted) {
            const arrayName = taskOptions.statusNames[task.status].replaceAll('_', '');
            tasks[arrayName].pagination.totalCount--;
            tasks[arrayName].data.splice(
                tasks[arrayName].data.findIndex(element => element.id === task.id),
                1
            );

            notify.success('Задача удалена');
        }
    }
};
const editTask = async oldTask => {
    const taskPayload = await showTaskCreator(oldTask);
    if (!taskPayload) return;

    const task = await api.task.update(oldTask.id, { ...oldTask, ...taskPayload });

    if (task) {
        Object.assign(oldTask, task);
    }
};

fetchTasks();
</script>
