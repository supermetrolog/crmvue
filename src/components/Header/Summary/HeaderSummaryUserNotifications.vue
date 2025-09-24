<template>
    <HeaderSummarySection
        :loading="isLoading && !isSilentLoading"
        :silent-loading="isSilentLoading"
        :modal-title="`Просмотр уведомлений (${countLabel})`"
        :count="count!"
        label="Новые уведомления"
        :class="{ danger: count! > 0, urgent: isUrgent }"
        sticky
    >
        <template #modal="{ close }">
            <HeaderSummaryUserNotificationsContent
                @close="close"
                @update-count="updateCount"
                :count="count!"
            />
        </template>
    </HeaderSummarySection>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import HeaderSummaryUserNotificationsContent from '@/components/Header/Summary/HeaderSummaryUserNotificationsContent.vue';
import api from '@/api/api.js';
import { useAsync } from '@/composables/useAsync';
import { useUserNotificationsBus } from '@/composables/useUserNotificationsBus';
import { plural } from '@/utils/plural';
import { useDocumentVisibility, useEventListener, useIntervalFn, useTimeoutFn } from '@vueuse/core';
import { useAuth } from '@/composables/useAuth';
import { publishNotificationFromWS } from '@/services/notifications/notifications';
import { RequestQueryParams } from '@/api/types';

const { isLoading, execute: fetchCount, data: count } = useAsync(api.userNotifications.count);

onBeforeMount(fetchCount);

const countLabel = computed(() => plural(count.value, '%d новое', '%d новых', '%d новых'));

// event bus

const notificationsBus = useUserNotificationsBus();

const off = notificationsBus.on(event => {
    if (event.type === 'acted' || event.type === 'created') {
        updateCount();
    }
});

const isUrgent = ref(false);

const { start, stop } = useTimeoutFn(
    () => {
        isUrgent.value = false;
        stop();
    },
    2000,
    { immediate: false }
);

function setUrgentStatus() {
    isUrgent.value = true;
    start();
}

const { isLoading: isSilentLoading, execute: updateCount } = useAsync(fetchCount, {
    onFetchResponse({ response }) {
        if ((response as number) > 0) {
            setUrgentStatus();
        }
    }
});

onUnmounted(off);

const countInterval = useIntervalFn(updateCount, 120000);
const documentVisibility = useDocumentVisibility();

watch(documentVisibility, current => {
    if (current === 'visible') {
        countInterval.resume();
    } else {
        countInterval.pause();
    }
});

useEventListener('beforeunload', () => countInterval.pause());

// urgent notifications

const { currentUserId } = useAuth();

const { execute: fetchImportantNotifications } = useAsync(
    (params: RequestQueryParams = {}) =>
        api.userNotifications.load({
            acted: 0,
            expired: 0,
            user_id: currentUserId.value,
            ...params
        }),
    {
        onFetchResponse({ response }) {
            if (response.length > 0) {
                response.forEach(notification => {
                    publishNotificationFromWS({
                        notification_id: notification.id,
                        priority: notification.template!.priority
                    });
                });
            }
        }
    }
);

onMounted(() => {
    fetchImportantNotifications({ priority: 'urgent' }).then(() =>
        fetchImportantNotifications({
            priority: 'high',
            viewed: 0
        })
    );
});
</script>
