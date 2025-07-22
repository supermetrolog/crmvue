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

<script setup>
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';

defineEmits(['show-task']);
const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
});

const sortedTasks = computed(() => {
    return [
        ...props.tasks.filter(task => task.status !== taskOptions.clearStatusTypes.COMPLETED),
        ...props.tasks.filter(task => task.status === taskOptions.clearStatusTypes.COMPLETED)
    ];
});
</script>
