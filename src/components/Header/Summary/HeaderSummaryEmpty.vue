<template>
    <div class="header-summary__empty">
        <Vue3Lottie
            :animation-data="loading ? SearchLottie : ChillLottie"
            :height="loading ? 204 : 170"
        />
        <DashboardChip v-if="!loading" class="dashboard-bg-success-l">
            {{ emptyTitle }}
        </DashboardChip>
    </div>
</template>
<script setup>
import ChillLottie from '@/assets/lotties/chill.json';
import SearchLottie from '@/assets/lotties/search.json';
import { Vue3Lottie } from 'vue3-lottie';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineProps({
    loading: Boolean,
    loadingTitle: {
        type: String,
        required: true
    },
    emptyTitle: {
        type: String,
        required: true
    }
});
</script>
