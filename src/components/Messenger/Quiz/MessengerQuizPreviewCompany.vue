<template>
    <a v-tippy="'Нажмите, чтобы открыть компанию'" :href="companyUrl" target="blank">
        <DashboardChip class="dashboard-bg-success-l text-dark" with-icon>
            <span> Компания #{{ companyId }}</span>
            <i class="fa-solid fa-up-right-from-square"></i>
        </DashboardChip>
    </a>
</template>
<script setup>
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { getLinkCompany } from '@/utils/url.js';

const props = defineProps({
    companyId: {
        type: Number,
        required: true
    }
});

const companyUrl = computed(() => getLinkCompany(props.companyId));
</script>
