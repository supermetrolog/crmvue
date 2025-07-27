<template>
    <div class="company-table-item-summary__tasks">
        <DashboardTableTasksItem
            v-for="task in sortedTasks"
            :key="task.id"
            @view="$emit('show-task', task)"
            :task="task"
            class="company-table-item-summary__task"
            :avatar-size="30"
            :observer-size="25"
            :show-diligence="false"
            :show-tags="false"
        />
    </div>
</template>

<script setup lang="ts">
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';
import { Task } from '@/types/task';

defineEmits<{ (e: 'show-task') }>();

const props = defineProps<{ tasks: Task[] }>();

const sortedTasks = computed(() => {
    return [
        ...props.tasks.filter(task => task.status !== taskOptions.clearStatusTypes.COMPLETED),
        ...props.tasks.filter(task => task.status === taskOptions.clearStatusTypes.COMPLETED)
    ];
});
</script>
