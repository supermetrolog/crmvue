<template>
    <section class="dashboard-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Дашборд</h1>
                    <DashboardTargetUser v-model="targetUser" class="ml-2" />
                </div>
                <div class="col-xl-9">
                    <DashboardStatsTasksCount :user="targetUser?.id" class="mb-3" />
                    <DashboardFavoriteTasks :user="targetUser?.id" class="mb-3" />
                    <!--                    <DashboardStatsEvents :user="targetUser?.id" class="mb-3" />-->
                    <DashboardStatsRequests :user="targetUser?.id" />
                </div>
                <div class="col-xl-3">
                    <DashboardCard title="Лог активности" class="mb-3">
                        <InProgress />
                    </DashboardCard>
                    <DashboardStatsMessages :user="targetUser?.id" />
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import InProgress from '@/components/common/InProgress.vue';
import DashboardStatsTasksCount from '@/components/Dashboard/Stats/DashboardStatsTasksCount.vue';
import DashboardStatsMessages from '@/components/Dashboard/Stats/DashboardStatsMessages.vue';
import DashboardStatsRequests from '@/components/Dashboard/Stats/DashboardStatsRequests.vue';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import DashboardFavoriteTasks from '@/components/Dashboard/DashboardFavoriteTasks.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const targetUser = ref({
    id: store.getters.THIS_USER.id,
    chat_member_id: store.getters.THIS_USER.chat_member_id
});
</script>
