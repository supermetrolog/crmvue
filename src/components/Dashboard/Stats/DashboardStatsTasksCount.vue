<template>
    <div class="row">
        <template v-if="isLoading">
            <div v-for="i in 4" :key="i" class="col-xl-3">
                <DashboardStatusCardSkeleton />
            </div>
        </template>
        <template v-else>
            <div class="col-xl-3">
                <DashboardStatusCard color="primary" label="Всего задач" icon="fa-solid fa-list-ul">
                    {{ counts.all.toFixed(0) }}
                </DashboardStatusCard>
            </div>
            <div class="col-xl-3">
                <DashboardStatusCard
                    color="success"
                    label="Выполнено"
                    icon="fa-regular fa-circle-check"
                >
                    {{ counts.completed.toFixed(0) }}
                </DashboardStatusCard>
            </div>
            <div class="col-xl-3">
                <DashboardStatusCard
                    color="warning"
                    label="В процессе"
                    icon="fa-regular fa-hourglass-half"
                >
                    {{ counts.inProgress.toFixed(0) }}
                </DashboardStatusCard>
            </div>
            <div class="col-xl-3">
                <DashboardStatusCard color="danger" label="Просрочено" icon="fa-solid fa-ban">
                    {{ counts.expired.toFixed(0) }}
                </DashboardStatusCard>
            </div>
        </template>
    </div>
</template>

<script>
import DashboardStatusCard from '@/components/Dashboard/DashboardStatusCard.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import api from '@/api/api.js';
import gsap from 'gsap';
import DashboardStatusCardSkeleton from '@/components/Dashboard/DashboardStatusCardSkeleton.vue';

export default {
    name: 'DashboardStatsTasksCount',
    components: { DashboardStatusCardSkeleton, DashboardStatusCard },
    mixins: [LoaderMixin],
    props: {
        user: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            counts: {
                all: 0,
                completed: 0,
                inProgress: 0,
                expired: 0
            }
        };
    },
    watch: {
        user() {
            this.fetchCounts();
        }
    },
    methods: {
        async fetchCounts() {
            this.loadingState = true;

            const userParams = this.user ? { user_id: this.user } : {};

            const data = await api.task.getStatistics(userParams);

            if (data) {
                const allTasksCount = Object.values(data).reduce(
                    (acc, element) => acc + Number(element),
                    0
                );

                gsap.to(this.counts, {
                    delay: 0.5,
                    duration: 1,
                    all: allTasksCount,
                    completed: Number(data.done),
                    inProgress: Number(data.accepted),
                    expired: Number(data.created)
                });
            }

            this.loadingState = false;
        }
    },
    created() {
        this.fetchCounts();
    }
};
</script>
