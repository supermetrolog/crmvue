<template>
    <div class="header-summary-dialogs__list">
        <Spinner v-if="loading" small class="absolute-center" />
        <slot v-else>
            <slot name="empty">
                <DashboardChip class="dashboard-bg-gray-l mt-5 mx-auto" with-icon>
                    <span>Список пуст</span>
                    <i class="fa-solid fa-comment-slash"></i>
                </DashboardChip>
            </slot>
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
