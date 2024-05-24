<template>
    <div class="dashboard-tasks-table">
        <template v-if="isLoading">
            <DashboardTasksItemSkeleton v-for="i in lastElementsCount" :key="i" />
        </template>
        <template v-else>
            <DashboardTableTasksItem
                v-for="task in tasks"
                :key="task.id"
                @delete="deleteTask(task)"
                @edit="$emit('edit', task)"
                @toggle-status="toggleStatus(task, $event)"
                :task="task"
                :editable="userCanEdit(task)"
                :draggable="userCanDrag(task)"
            />
            <EmptyData v-if="!tasks.length">Список задач пуст..</EmptyData>
        </template>
    </div>
</template>

<script>
import DashboardTableTasksItem from '@/components/Dashboard/Table/DashboardTableTasksItem.vue';
import api from '@/api/api.js';
import DashboardTasksItemSkeleton from '@/components/Dashboard/Table/DashboardTableTasksItemSkeleton.vue';
import { mapGetters } from 'vuex';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'DashboardTableTasks',
    components: { EmptyData, DashboardTasksItemSkeleton, DashboardTableTasksItem },
    emits: ['update', 'edit'],
    inject: ['$confirmPopup'],
    props: {
        tasks: {
            type: Array,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            lastElementsCount: 5
        };
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' })
    },
    watch: {
        isLoading(value) {
            if (!value) this.lastElementsCount = Math.min(this.tasks.length, 5) || 4;
        }
    },
    methods: {
        async deleteTask(task) {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите безвозвратно удалить задачу?'
            );
            if (!confirmed) return;

            const deleted = await api.task.delete(task.id);
            if (deleted) {
                task.deleted_at = new Date();
                this.$toast('Задача успешно удалена');
            }
        },
        async editTask(oldTask) {
            const taskPayload = await this.$refs.taskForm.open(oldTask);
            if (!taskPayload) return;

            const task = await api.task.update(oldTask.id, { ...oldTask, ...taskPayload });

            if (task) {
                Object.assign(oldTask, task);
                this.$toast('Задача успешно изменена');
            }
        },
        async toggleStatus(task, status) {
            const newTask = await api.task.update(task.id, { ...task, status });

            if (task) {
                Object.assign(task, newTask);
                this.$toast('Статус задачи успешно изменен');
            }
        },
        userCanDrag(task) {
            return (
                task.deleted_at === null &&
                (Number(task.created_by_id) === Number(this.currentUser.id) ||
                    Number(task.user_id) === Number(this.currentUser.id) ||
                    this.$store.getters.isModerator)
            );
        },
        userCanEdit(task) {
            return (
                Number(task.created_by_id) === Number(this.currentUser.id) ||
                this.$store.getters.isModerator
            );
        }
    }
};
</script>
