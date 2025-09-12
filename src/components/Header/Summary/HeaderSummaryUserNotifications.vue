<template>
    <HeaderSummarySection
        :loading="isLoading && !isSilentLoading"
        :silent-loading="isSilentLoading"
        :modal-title="`Просмотр уведомлений (${countLabel})`"
        :count
        label="Новые уведомления"
        class="danger"
        sticky
    >
        <template #modal="{ close }">
            <HeaderSummaryUserNotificationsContent @close="close" :count />
        </template>
    </HeaderSummarySection>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, watch } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import HeaderSummaryUserNotificationsContent from '@/components/Header/Summary/HeaderSummaryUserNotificationsContent.vue';
import api from '@/api/api.js';
import { useAsync } from '@/composables/useAsync';
import { useUserNotificationsBus } from '@/composables/useUserNotificationsBus';
import { plural } from '@/utils/plural';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';

const {
    isLoading,
    execute: fetchCount,
    data: count
} = useAsync(() => api.userNotifications.count());

onBeforeMount(fetchCount);

const countLabel = computed(() => plural(count.value, '%d новое', '%d новых', '%d новых'));

// event bus

const notificationsBus = useUserNotificationsBus();

const off = notificationsBus.on(event => {
    if (event.type === 'acted' || event.type === 'created') {
        updateCount();
    }
});

const { isLoading: isSilentLoading, execute: updateCount } = useAsync(fetchCount);

onUnmounted(off);

const countInterval = useIntervalFn(updateCount, 120000);
const documentVisibility = useDocumentVisibility();

watch(documentVisibility, (current, prev) => {
    if (current === 'visible' && prev === 'hidden') {
        countInterval.resume();
    } else {
        countInterval.pause();
    }
});
</script>
