<template>
    <HeaderSummarySection
        :loading="someIsLoading"
        :modal-width="1000"
        :modal-title="`Просмотр предложений для обзвона (${count})`"
        :count
        label="Обзвон предложений"
        class="warning"
    >
        <template #modal="{ close }">
            <HeaderSummaryObjectCallsContent @close="close" />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';
import HeaderSummaryObjectCallsContent from '@/components/Header/Summary/HeaderSummaryObjectCallsContent.vue';

const { objectCounts, fetchStatistics, someIsLoading } = useSharedMessengerStatistic();

const count = computed(() => objectCounts?.value?.outdated_call_count ?? 0);

onMounted(fetchStatistics);
</script>
