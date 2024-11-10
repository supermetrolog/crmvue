<template>
    <div class="company-picker-option">
        <CompanyLogo as="div" :size="30" :company-id="option.value" :src="option.logo" />
        <span class="company-picker-option__label">{{ option.label }}</span>
        <span class="ml-auto company-picker-option__id">#{{ option.value }}</span>
    </div>
</template>
<script setup>
import CompanyLogo from '@/components/Company/CompanyLogo.vue';

defineProps({
    option: {
        type: Object,
        required: true
    }
});
</script>
