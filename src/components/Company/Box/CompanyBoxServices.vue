<template>
    <CompanyBoxLayout class="CompanyBoxServices" :class="'grid-e'">
        <template #header>
            <div class="CompanyBoxServices-header">
                <span>УСЛУГИ ({{ services.length }})</span>
            </div>
        </template>
        <template #content>
            <div v-if="!services.length" class="company-box-empty">
                <InProgress />
            </div>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import InProgress from '@/components/common/InProgress.vue';

export default {
    name: 'CompanyBoxServices',
    components: { InProgress, CompanyBoxLayout },
    props: {
        services: {
            type: Array,
            default: () => []
        }
    }
};
</script>
