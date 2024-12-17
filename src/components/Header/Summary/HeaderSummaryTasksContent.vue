<template>
    <div>
        <Button @click="fetchTasks" :disabled="isLoading" class="ml-auto" small icon>
            <span>Обновить</span>
            <i class="fa-solid fa-refresh" />
        </Button>
        <DashboardTableTasks
            @task-updated="onTaskUpdated"
            :tasks="tasks.data"
            :is-loading="isLoading"
            class="mb-3 pt-3"
        />
        <PaginationClassic
            v-if="!isLoading && tasks.pagination"
            @next="loadTasks"
            :pagination="tasks.pagination"
        />
    </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import api from '@/api/api.js';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Button from '@/components/common/Button.vue';
import { useAuth } from '@/composables/useAuth.js';

const emit = defineEmits(['count-updated']);

const { currentUserId } = useAuth();
const { isLoading } = useDelayedLoader();

const tasks = reactive({
    data: [],
    pagination: null
});

async function fetchTasks(page = 1) {
    isLoading.value = true;

    const response = await api.task.get({
        observer_id: currentUserId.value,
        page,
        observed: 0
    });
    if (response) {
        tasks.data = response.data;
        tasks.pagination = response.pagination;

        emit('count-updated', tasks.pagination.totalCount);
    }

    isLoading.value = false;
}

onMounted(fetchTasks);

const loadTasks = page => fetchTasks(page);

function onTaskUpdated(task) {
    const taskIndex = tasks.data.findIndex(element => element.id === task.id);
    if (taskIndex !== -1) Object.assign(tasks.data[taskIndex], task);

    emit('count-updated', tasks.pagination.totalCount - 1);
}
</script>
