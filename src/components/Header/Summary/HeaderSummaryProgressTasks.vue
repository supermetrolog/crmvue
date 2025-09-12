<template>
    <HeaderSummarySection
        :modal-title="`Просмотр невыполненных задач (${count})`"
        :loading="isLoading"
        :count
        label="Невыполненные задачи"
    >
        <template #modal="{ close }">
            <HeaderSummaryProgressTasksContent
                @close="close"
                @count-updated="onCountUpdated"
                :count
            />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { onMounted, ref } from 'vue';

import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import HeaderSummaryProgressTasksContent from '@/components/Header/Summary/HeaderSummaryProgressTasksContent.vue';
import { useEventBus } from '@vueuse/core';
import { TASK_EVENTS } from '@/const/events/task.js';
import { taskOptions } from '@/const/options/task.options.js';

const { currentUserId } = useAuth();

const { isLoading } = useDelayedLoader();

const count = ref(0);

async function fetchCounts() {
    isLoading.value = true;

    const response = await api.task.getCounts({ user_id: currentUserId.value });
    if (response) {
        count.value = response.created + response.accepted;
    }

    isLoading.value = false;
}

function onCountUpdated(value) {
    count.value = value;
}

onMounted(fetchCounts);

// event bus

const taskCompleteEvent = useEventBus(TASK_EVENTS.COMPLETE);
const reassignEvent = useEventBus(TASK_EVENTS.REASSIGN);

taskCompleteEvent.on(() => {
    count.value--;
});

reassignEvent.on(payload => {
    if (payload.oldUserId === currentUserId.value) {
        if (
            payload.task.status !== taskOptions.clearStatusTypes.COMPLETED &&
            payload.task.status !== taskOptions.clearStatusTypes.CANCELED
        )
            count.value--;
    } else if (payload.task.user_id === currentUserId.value) {
        if (
            payload.task.status !== taskOptions.clearStatusTypes.COMPLETED &&
            payload.task.status !== taskOptions.clearStatusTypes.CANCELED
        )
            count.value++;
    }
});
</script>
