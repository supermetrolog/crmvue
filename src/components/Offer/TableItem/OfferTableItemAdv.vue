<template>
    <div class="offer-table-item__advertisements">
        <DashboardChip v-if="offer.ad_realtor" class="dashboard-bg-light">
            Raysarma.ru
        </DashboardChip>
        <DashboardChip v-if="offer.ad_cian" class="dashboard-bg-light">Циан</DashboardChip>
        <DashboardChip v-if="offer.ad_yandex" class="dashboard-bg-light"> Яндекс</DashboardChip>
        <DashboardChip v-if="offer.ad_avito" class="dashboard-bg-light"> Авито</DashboardChip>
        <DashboardChip v-if="offer.ad_free" class="dashboard-bg-light"> Бесплатные</DashboardChip>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
