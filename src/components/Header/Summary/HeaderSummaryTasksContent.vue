<template>
    <div>
        <UiButton
            @click="fetchTasks()"
            :loading="isLoading"
            small
            class="ml-auto mb-2"
            icon="fa-solid fa-refresh"
            color="light"
        >
            Обновить
        </UiButton>
        <div class="header-summary__list my-2">
            <HeaderSummaryEmpty
                v-if="!count"
                :loading="isLoading"
                empty-title="Новых задач нет. Отлично!"
                loading-title="Поиск задач.."
            />
            <DashboardTableTasks
                @hide="emit('close')"
                @task-updated="onTaskUpdated"
                :hidden="!count"
                :tasks="tasks.data"
            />
        </div>
        <PaginationClassic
            v-if="!isLoading && tasks.pagination?.totalCount"
            @next="fetchTasks"
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
import { useAuth } from '@/composables/useAuth';
import HeaderSummaryEmpty from '@/components/Header/Summary/HeaderSummaryEmpty.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['count-updated', 'close']);
const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
});

const { currentUserId } = useAuth();
const { isLoading } = useDelayedLoader(props.count > 0);

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

onMounted(() => {
    if (props.count > 0) fetchTasks();
});

function onTaskUpdated(task) {
    const taskIndex = tasks.data.findIndex(element => element.id === task.id);
    if (taskIndex !== -1) Object.assign(tasks.data[taskIndex], task);

    emit('count-updated', tasks.pagination.totalCount - 1);
}
</script>
