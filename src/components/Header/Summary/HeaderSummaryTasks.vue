<template>
    <HeaderSummarySection
        :loading="someIsLoading"
        :modal-title="`Просмотр новых задач (${count})`"
        :count
        label="Новые задачи"
    >
        <template #modal="{ close }">
            <HeaderSummaryTasksContent @close="close" @count-updated="onCountUpdated" :count />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import HeaderSummaryTasksContent from '@/components/Header/Summary/HeaderSummaryTasksContent.vue';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';
import { useEventBus } from '@vueuse/core';
import { TASK_EVENTS } from '@/const/events/task.js';

const { someIsLoading, objectCounts, companiesCounts, userCounts, fetchStatistics, isUpdating } =
    useSharedMessengerStatistic();

onMounted(fetchStatistics);

watch(
    () => [someIsLoading.value, isUpdating.value],
    ([someIsLoadingValue, isUpdatingValue]) => {
        if (!someIsLoadingValue && !isUpdatingValue) {
            count.value =
                objectCounts.value.unread_task_count +
                companiesCounts.value.unread_task_count +
                userCounts.value.unread_task_count;
        }
    }
);

const count = ref(0);

const onCountUpdated = value => (count.value = value);

// event bus

const bus = useEventBus(TASK_EVENTS.READ);

bus.on(() => {
    count.value--;
});
</script>
