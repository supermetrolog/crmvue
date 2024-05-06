<template>
    <section class="dashboard-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Сводка компании</h1>
                    <DashboardTargetUser v-model="targetUserID" />
                </div>
                <div class="col-xl-9">
                    <DashboardStatsTasksCount class="mb-3" :user="targetUserID" />
                    <div class="row mb-3">
                        <div class="col-6">
                            <DashboardCard title="Статистика активности">
                                <InProgress />
                            </DashboardCard>
                        </div>
                        <div class="col-6">
                            <DashboardCard title="События сегодня">
                                <InProgress />
                            </DashboardCard>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <DashboardCard
                                title="Последние таймлайны"
                                view-all-link="/dashboard/timelines"
                            >
                                <InProgress />
                            </DashboardCard>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3">
                    <DashboardCard title="Лог активности" class="mb-3">
                        <InProgress />
                    </DashboardCard>
                    <DashboardCard title="Последние сообщения">
                        <InProgress />
                    </DashboardCard>
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

export default {
    name: 'DashboardCompany',
    components: { DashboardTargetUser, DashboardStatsTasksCount, InProgress, DashboardCard },
    data() {
        return {
            targetUserID: null
        };
    }
};
</script>
