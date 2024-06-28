<template>
    <section class="dashboard-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Сводка компании</h1>
                    <DashboardTargetUser v-model="targetUser" />
                </div>
                <div class="col-xl-9">
                    <DashboardStatsTasksCount class="mb-3" :user="targetUser?.id" />
                    <DashboardStatsEvents :user="targetUser?.id" class="mb-3" />
                    <DashboardStatsRequests :user="targetUser?.id" />
                </div>
                <div class="col-xl-3">
                    <DashboardCard title="Лог активности" class="mb-3">
                        <InProgress />
                    </DashboardCard>
                    <DashboardStatsMessages :user="targetUser?.chat_member_id" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import InProgress from '@/components/common/InProgress.vue';
import DashboardStatsTasksCount from '@/components/Dashboard/Stats/DashboardStatsTasksCount.vue';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import DashboardStatsMessages from '@/components/Dashboard/Stats/DashboardStatsMessages.vue';
import DashboardStatsRequests from '@/components/Dashboard/Stats/DashboardStatsRequests.vue';
import DashboardStatsEvents from '@/components/Dashboard/Stats/DashboardStatsEvents.vue';

export default {
    name: 'DashboardCompany',
    components: {
        DashboardStatsEvents,
        DashboardStatsRequests,
        DashboardStatsMessages,
        DashboardTargetUser,
        DashboardStatsTasksCount,
        InProgress,
        DashboardCard
    },
    data() {
        return {
            targetUser: null
        };
    }
};
</script>
