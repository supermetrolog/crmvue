<template>
    <div class="row">
        <CompanyGridItem v-for="company of companies" :key="company.id" :company="company" />
    </div>
</template>

<script setup>
import CompanyGridItem from '@/components/Company/CompanyGridItem.vue';

defineProps({ companies: { type: Array, default: () => [] } });
</script>
