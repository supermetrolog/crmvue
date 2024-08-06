<template>
    <router-link class="header-link" :to="data.url" exact-active-class="active" :exact="data.exact">
        <DashboardChip class="header-link__chip dashboard-bg-gray-l">
            {{ data.name }}
        </DashboardChip>
    </router-link>
</template>

<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineProps({
    data: {
        type: Object,
        required: true
    }
});
</script>
