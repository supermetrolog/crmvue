<template>
    <div class="container-fluid">
        <teleport to="body">
            <FormModalTask ref="taskForm" />
        </teleport>
        <div class="row">
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="newTasks.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'new')"
                    @add="changeTaskStatus($event, 'new')"
                    :pagination="newTasks.pagination"
                    :is-loading="isLoading"
                    title="Новые"
                >
                    <template #icon>
                        <DashboardRoundedIcon
                            icon="fa-solid fa-list-ul"
                            class="dashboard-bg-primary-l"
                        />
                    </template>
                    <template #action>
                        <Button @click="createTask" small success> Создать задачу </Button>
                    </template>
                </DashboardKanbanBoard>
            </div>
            <div class="col-3">
                <DashboardKanbanBoard
                    v-model="inProgressTasks.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'inProgress')"
                    @add="changeTaskStatus($event, 'in_Progress')"
                    :pagination="inProgressTasks.pagination"
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
                    v-model="completedTasks.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'completed')"
                    @add="changeTaskStatus($event, 'completed')"
                    :pagination="completedTasks.pagination"
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
                    v-model="canceledTasks.data"
                    @delete="deleteTask"
                    @edit="editTask"
                    @load="loadTasks($event, 'canceled')"
                    @add="changeTaskStatus($event, 'canceled')"
                    :pagination="canceledTasks.pagination"
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
<script>
import DashboardKanbanBoard from '@/components/Dashboard/Kanban/DashboardKanbanBoard.vue';
import api from '@/api/api.js';
import DashboardRoundedIcon from '@/components/Dashboard/DashboardRoundedIcon.vue';
import { entityOptions } from '@/const/options/options.js';
import Button from '@/components/common/Button.vue';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'DashboardTasksBoard',
    components: { FormModalTask, Button, DashboardRoundedIcon, DashboardKanbanBoard },
    mixins: [LoaderMixin],
    inject: ['$targetUser'],
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    data() {
        return {
            newTasks: {
                data: [],
                pagination: null
            },
            inProgressTasks: {
                data: [],
                pagination: null
            },
            completedTasks: {
                data: [],
                pagination: null
            },
            canceledTasks: {
                data: [],
                pagination: null
            },
            createFormIsVisible: false
        };
    },
    computed: {
        targetUser() {
            return this.$targetUser();
        }
    },
    watch: {
        targetUser() {
            this.fetchTasks();
        }
    },
    methods: {
        async fetchTasks() {
            this.loadingState = true;

            [this.newTasks, this.inProgressTasks, this.completedTasks, this.canceledTasks] =
                await this.$store.dispatch('Task/getTasks', this.targetUser?.id);

            this.loadingState = false;
        },
        async loadTasks($state, statusName) {
            const { currentPage, pageCount } = this[`${statusName}Tasks`].pagination;

            if (pageCount === 0 || currentPage === pageCount) {
                $state.complete();
                return;
            }

            const statusID = entityOptions.task.statusTypes[statusName];
            const page = currentPage + 1;

            const response = await api.task.get({ status: statusID, page, deleted: 0 });

            if (response) {
                this[`${statusName}Tasks`].pagination = response.pagination;
                this[`${statusName}Tasks`].data.push(...response.data);

                if (response.pagination.currentPage === response.pagination.pageCount)
                    $state.complete();
                else $state.loaded();
            }
        },
        async changeTaskStatus(task, statusName) {
            task.isUpdating = true;

            const status = entityOptions.task.statusTypes[statusName.toUpperCase()];
            const updatedTask = await api.task.changeStatus(task.id, status);

            const prevArrayName =
                entityOptions.task.statusNames[task.status].replaceAll('_', '') + 'Tasks';
            const tasksArrayName = `${statusName.replaceAll('_', '')}Tasks`;

            if (updatedTask) {
                task.status = status;
                this[prevArrayName].pagination.totalCount--;
                this[tasksArrayName].pagination.totalCount++;

                this.$notify('Статус задачи успешно изменен');
            } else {
                this[prevArrayName].data.unshift(task);
                this[tasksArrayName].data.splice(
                    this[tasksArrayName].data.findIndex(element => element.id === task.id),
                    1
                );
            }

            task.isUpdating = false;
        },
        async deleteTask(task) {
            const confirmed = await this.confirm('Вы уверены, что хотите удалить задачу?');

            if (confirmed) {
                const deleted = await api.task.delete(task.id);

                if (deleted) {
                    const arrayName =
                        entityOptions.task.statusNames[task.status].replaceAll('_', '') + 'Tasks';
                    this[arrayName].pagination.totalCount--;
                    this[arrayName].data.splice(
                        this[arrayName].data.findIndex(element => element.id === task.id),
                        1
                    );

                    this.$notify('Задача удалена');
                }
            }
        },
        async createTask() {
            const taskPayload = await this.$refs.taskForm.open();
            if (!taskPayload) return;

            const task = await api.task.create({
                ...taskPayload,
                status: 1
            });

            if (task) {
                this.newTasks.data.unshift(task);
                this.newTasks.pagination.totalCount++;
            }
        },
        async editTask(oldTask) {
            const taskPayload = await this.$refs.taskForm.open(oldTask);
            if (!taskPayload) return;

            const task = await api.task.update(oldTask.id, { ...oldTask, ...taskPayload });

            if (task) {
                Object.assign(oldTask, task);
            }
        }
    },
    created() {
        this.fetchTasks();
    }
};
</script>
