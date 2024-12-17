<template>
    <HeaderSummarySection
        :modal-title="`Просмотр невыполненных задач (${count})`"
        :loading="isLoading"
        :count
        label="Невыполненные задачи"
    >
        <template #modal>
            <HeaderSummaryProgressTasksContent @count-updated="onCountUpdated" />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { onMounted, ref } from 'vue';

import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import HeaderSummaryProgressTasksContent from '@/components/Header/Summary/HeaderSummaryProgressTasksContent.vue';

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
</script>
