<template>
    <DashboardCard class="dashboard-stats-block">
        <template #header>
            <div class="dashboard-stats-block__header">
                <h3 class="dashboard-card__title">
                    <span>Избранные задачи</span>
                    <span v-if="!favoriteTasksIsLoading || favoriteTasksEntities.length">
                        ({{ favoriteTasksEntities.length }})
                    </span>
                </h3>
                <MessengerButton @click="fetchFavoriteTasks">Обновить</MessengerButton>
            </div>
        </template>
        <div class="row">
            <div class="col-12">
                <Spinner v-if="favoriteTasksIsLoading" center />
                <DashboardTableFavoriteTasks v-else class="mb-4" />
            </div>
        </div>
    </DashboardCard>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import Spinner from '@/components/common/Spinner.vue';
import { onMounted } from 'vue';
import { useFavoriteTasks } from '@/composables/useFavoriteTasks.js';
import DashboardTableFavoriteTasks from '@/components/Dashboard/Table/DashboardTableFavoriteTasks.vue';

const { fetchFavoriteTasks, favoriteTasksIsLoading, favoriteTasksEntities } = useFavoriteTasks();

onMounted(fetchFavoriteTasks);
</script>
