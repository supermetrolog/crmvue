<template>
    <div class="messenger-quiz-preview-tasks">
        <div class="d-flex gap-1 mb-2">
            <DashboardChip class="dashboard-bg-gray-l">
                <span>{{ pluralTasksCount }} по опроснику</span>
            </DashboardChip>
            <DashboardChip
                :class="
                    completedTasksCount === tasks.length
                        ? 'dashboard-bg-success-l'
                        : 'dashboard-bg-gray-l'
                "
                with-icon
            >
                <i v-if="completedTasksCount === tasks.length" class="fa-solid fa-check" />
                <span>Выполнено: {{ completedTasksCount }}/{{ tasks.length }}</span>
            </DashboardChip>
        </div>
        <DashboardTableTasks @hide="$emit('hide')" @task-updated="onTaskUpdated" :tasks />
    </div>
</template>
<script setup>
import { computed, toRef } from 'vue';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { isCompletedTask } from '@/utils/helpers/models/task.js';
import { usePlural } from '@/composables/usePlural.js';

const tasks = defineModel('tasks');
defineEmits(['hide']);

const pluralTasksCount = usePlural(
    toRef(() => tasks.value?.length),
    '+%d задача',
    '+%d задачи',
    '+%d задач'
);

const completedTasksCount = computed(() =>
    tasks.value.reduce((acc, task) => acc + (isCompletedTask(task) ? 1 : 0), 0)
);

function onTaskUpdated(task) {
    const taskIndex = tasks.value.findIndex(element => element.id === task.id);
    if (taskIndex !== -1) Object.assign(tasks.value[taskIndex], task);
}
</script>
