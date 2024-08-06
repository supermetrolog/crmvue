<template>
    <section class="dashboard-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 mb-2">
                    <h1>Дашборд</h1>
                </div>
                <div class="col-xl-9">
                    <DashboardStatsTasksCount :user="user?.id" class="mb-3" />
                    <DashboardStatsEvents :user="user?.id" class="mb-3" />
                    <DashboardStatsRequests :user="user?.id" />
                </div>
                <div class="col-xl-3">
                    <DashboardCard title="Лог активности" class="mb-3">
                        <InProgress />
                    </DashboardCard>
                    <DashboardStatsMessages :user="user?.chat_member_id" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import InProgress from '@/components/common/InProgress.vue';
import DashboardStatsTasksCount from '@/components/Dashboard/Stats/DashboardStatsTasksCount.vue';
import { mapGetters } from 'vuex';
import DashboardStatsMessages from '@/components/Dashboard/Stats/DashboardStatsMessages.vue';
import DashboardStatsRequests from '@/components/Dashboard/Stats/DashboardStatsRequests.vue';
import DashboardStatsEvents from '@/components/Dashboard/Stats/DashboardStatsEvents.vue';

export default {
    name: 'DashboardMain',
    components: {
        DashboardStatsEvents,
        DashboardStatsRequests,
        DashboardStatsMessages,
        DashboardStatsTasksCount,
        DashboardCard,
        InProgress
    },
    computed: {
        ...mapGetters({ user: 'THIS_USER' })
    }
};
</script>
