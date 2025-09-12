<template>
    <div>
        <div class="white-block mb-3">
            <PaginationClassic @next="setNextPage" :pagination="pagination" :loading="isLoading" />
        </div>
        <Spinner v-if="isLoading && !notifications.length" />
        <AdminNotificationsTable
            v-else
            @open="showUserNotification"
            :loading="isLoading"
            :notifications
        />
        <teleport to="body">
            <UserNotificationPreview
                v-model:visible="previewIsVisible"
                @closed="onClosePreview"
                :notification-id="viewingUserNotificationId"
            />
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '@/components/common/Spinner.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { useDebounceFn } from '@vueuse/core';
import api from '@/api/api.js';
import AdminNotificationsTable from '@/components/Admin/Notifications/AdminNotificationsTable.vue';
import UserNotificationPreview from '@/components/UserNotificationPreview/UserNotificationPreview.vue';
import { ShortUserNotification } from '@/types/user-notification/user-notification';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const notifications = ref<ShortUserNotification[]>([]);
const pagination = ref(null);

async function fetchNotifications() {
    isLoading.value = true;

    const response = await api.userNotifications.list({ page: route.query.page ?? 1 });

    if (response) {
        notifications.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchNotifications);

const debouncedFetchNotifications = useDebounceFn(fetchNotifications, 200);

watch(() => route.query?.page, debouncedFetchNotifications);

function setNextPage(page: number) {
    router.replace({ query: { ...route.query, page } });
}

// preview

const previewIsVisible = ref(false);
const viewingUserNotificationId = ref<number | null>(null);

function showUserNotification(notificationId: number) {
    viewingUserNotificationId.value = notificationId;
    previewIsVisible.value = true;
}

function onClosePreview() {
    viewingUserNotificationId.value = null;
}
</script>
