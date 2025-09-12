<template>
    <div class="header-summary">
        <HeaderSummaryTasks />
        <HeaderSummaryProgressTasks />
        <HeaderSummaryMessages />
        <HeaderSummaryCompanyCalls />
        <HeaderSummaryObjectCalls />
        <HeaderSummaryUserNotifications />
    </div>
</template>
<script setup>
import HeaderSummaryTasks from '@/components/Header/Summary/HeaderSummaryTasks.vue';
import HeaderSummaryMessages from '@/components/Header/Summary/Messages/HeaderSummaryMessages.vue';
import HeaderSummaryCompanyCalls from '@/components/Header/Summary/HeaderSummaryCompanyCalls.vue';
import HeaderSummaryObjectCalls from '@/components/Header/Summary/HeaderSummaryObjectCalls.vue';
import HeaderSummaryProgressTasks from '@/components/Header/Summary/HeaderSummaryProgressTasks.vue';
import HeaderSummaryUserNotifications from '@/components/Header/Summary/HeaderSummaryUserNotifications.vue';
</script>
