<template>
    <HeaderSummarySection
        :loading="someIsLoading"
        :modal-title="`Просмотр новых сообщений (${count})`"
        :modal-width="1200"
        :count
        label="Новые сообщения"
    >
        <template #modal="{ close }">
            <HeaderSummaryMessagesContent @close="close" :count />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import HeaderSummaryMessagesContent from '@/components/Header/Summary/HeaderSummaryMessagesContent.vue';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';

const { companiesCounts, userCounts, objectCounts, fetchStatistics, someIsLoading } =
    useSharedMessengerStatistic();

onMounted(fetchStatistics);

const count = computed(() => {
    return (
        objectCounts.value.unread_message_count +
        companiesCounts.value.unread_message_count +
        userCounts.value.unread_message_count
    );
});
</script>
