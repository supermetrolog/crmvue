<template>
    <div class="header-summary__empty">
        <Vue3Lottie
            :animation-data="isLoading ? SearchLottie : ChillLottie"
            :height="isLoading ? 204 : 170"
        />
        <DashboardChip v-if="!isLoading" class="dashboard-bg-success-l">
            {{ emptyTitle }}
        </DashboardChip>
    </div>
</template>
<script setup>
import ChillLottie from '@/assets/lotties/chill.json';
import SearchLottie from '@/assets/lotties/search.json';
import { Vue3Lottie } from 'vue3-lottie';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { watch } from 'vue';

const props = defineProps({
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

const { isLoading } = useDelayedLoader(false, 2000);

watch(
    () => props.loading,
    value => {
        isLoading.value = value;
    }
);
</script>
