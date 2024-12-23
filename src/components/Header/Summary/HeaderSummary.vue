<template>
    <div class="header-summary">
        <HeaderSummaryTasks />
        <HeaderSummaryProgressTasks />
        <HeaderSummaryMessages />
        <HeaderSummaryCompanyCalls />
        <HeaderSummaryObjectCalls />
        <HeaderSummaryAdditional />
    </div>
</template>
<script setup>
import HeaderSummaryAdditional from '@/components/Header/Summary/HeaderSummaryAdditional.vue';
import HeaderSummaryTasks from '@/components/Header/Summary/HeaderSummaryTasks.vue';
import HeaderSummaryMessages from '@/components/Header/Summary/HeaderSummaryMessages.vue';
import HeaderSummaryCompanyCalls from '@/components/Header/Summary/HeaderSummaryCompanyCalls.vue';
import HeaderSummaryObjectCalls from '@/components/Header/Summary/HeaderSummaryObjectCalls.vue';
import HeaderSummaryProgressTasks from '@/components/Header/Summary/HeaderSummaryProgressTasks.vue';
</script>
