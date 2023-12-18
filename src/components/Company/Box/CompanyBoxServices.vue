<template>
    <CompanyBoxLayout class="CompanyBoxServices" :class="'grid-e'">
        <template #header>
            <div class="CompanyBoxServices-header">
                <span>УСЛУГИ ({{ services.length }})</span>
            </div>
        </template>
        <template #content>
            <NoData v-if="!services.length" />
            <Joke />
        </template>
    </CompanyBoxLayout>
</template>

<script>
import Joke from '@/components/common/Joke.vue';
import NoData from '@/components/common/NoData.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';

export default {
    name: 'CompanyBoxServices',
    components: { CompanyBoxLayout, NoData, Joke },
    props: {
        services: {
            type: Array,
            default: () => []
        }
    }
};
</script>