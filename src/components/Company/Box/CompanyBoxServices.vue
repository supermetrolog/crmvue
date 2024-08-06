<template>
    <CompanyBoxLayout class="CompanyBoxServices" :class="'grid-e'">
        <template #header>
            <div class="CompanyBoxServices-header">
                <span>УСЛУГИ ({{ services.length }})</span>
            </div>
        </template>
        <template #content>
            <div v-if="!services.length" class="company-box-empty">
                <EmptyData class="company-box-empty__data"> Нет данных </EmptyData>
            </div>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'CompanyBoxServices',
    components: { EmptyData, CompanyBoxLayout },
    props: {
        services: {
            type: Array,
            default: () => []
        }
    }
};
</script>
