<template>
    <HeaderSummarySection
        :loading="someIsLoading"
        :modal-width="1000"
        :modal-title="`Просмотр клиентов для обзвона (${count})`"
        :count
        label="Обзвон клиентов"
        class="warning"
    >
        <template #modal="{ close }">
            <HeaderSummaryCompanyCallsContent @close="close" />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import HeaderSummaryCompanyCallsContent from '@/components/Header/Summary/HeaderSummaryCompanyCallsContent.vue';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';

const { companiesCounts, fetchStatistics, someIsLoading } = useSharedMessengerStatistic();

const count = computed(() => companiesCounts?.value?.outdated_call_count ?? 0);

onMounted(fetchStatistics);
</script>
