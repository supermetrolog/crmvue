<template>
    <div>
        <div class="white-block mb-3">
            <PaginationClassic @next="setNextPage" :pagination="pagination" :loading="isLoading" />
        </div>
        <Spinner v-if="isLoading && !logs.length" />
        <AdminNotificationsLogsTable v-else :loading="isLoading" :logs />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '@/components/common/Spinner.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { useDebounceFn } from '@vueuse/core';
import api from '@/api/api.js';
import AdminNotificationsLogsTable from '@/components/Admin/Notifications/AdminNotificationsLogsTable.vue';
import { SearchedUserNotificationActionLog } from '@/types/user-notification/user-notification-action';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const logs = ref<SearchedUserNotificationActionLog[]>([]);
const pagination = ref(null);

async function fetchNotificationActionLogs() {
    isLoading.value = true;

    const response = await api.userNotificationActionLogs.list({ page: route.query.page ?? 1 });

    if (response) {
        logs.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchNotificationActionLogs);

const debouncedFetchNotificationActionLogs = useDebounceFn(fetchNotificationActionLogs, 200);

watch(() => route.query?.page, debouncedFetchNotificationActionLogs);

function setNextPage(page: number) {
    router.replace({ query: { ...route.query, page } });
}
</script>
