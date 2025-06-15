<template>
    <div class="company-table-item-survey__tasks">
        <DashboardTableTasksItem
            v-for="task in tasks"
            :key="task.id"
            @view="$emit('show-task', task)"
            :task="task"
            class="company-table-item-survey__task"
            :avatar-size="35"
            :observer-size="25"
            :show-diligence="false"
        />
    </div>
</template>

<script setup>
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';

defineEmits(['show-task']);
defineProps({
    tasks: {
        type: Array,
        required: true
    }
});
</script>
