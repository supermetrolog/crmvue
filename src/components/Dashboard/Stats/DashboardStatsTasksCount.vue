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

            const data = await Promise.all([
                api.task.getCount(userParams),
                api.task.getCount({ ...userParams, status: 3 }),
                api.task.getCount({ ...userParams, status: 2 }),
                api.task.getCount({ ...userParams, expired: 1 })
            ]);

            if (data.length) {
                gsap.to(this.counts, {
                    delay: 0.5,
                    duration: 1,
                    all: data[0],
                    completed: data[1],
                    inProgress: data[2],
                    expired: data[3]
                });
                // this.counts = {
                //     all: data[0],
                //     completed: data[1],
                //     inProgress: data[2],
                //     expired: data[3]
                // };
            }

            this.loadingState = false;
        }
    },
    created() {
        this.fetchCounts();
    }
};
</script>
