<template>
    <div class="header-summary-dialogs__grid">
        <Spinner v-if="loading" class="small absolute-center" />
        <slot v-else>
            <DashboardChip class="dashboard-bg-gray-l mt-5 mx-auto" with-icon>
                <span>Список пуст</span>
                <i class="fa-solid fa-comment-slash"></i>
            </DashboardChip>
        </slot>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineProps({
    loading: Boolean
});
</script>
