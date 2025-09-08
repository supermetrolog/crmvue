<template>
    <div class="user-notification-preview">
        <Spinner v-if="previewIsLoading" label="Загрузка уведомления.." class="absolute-center" />
        <UserNotificationCard
            v-else-if="currentNotification"
            @updated="onUpdated"
            :notification="currentNotification"
        />
    </div>
</template>
<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import { onBeforeMount, ref } from 'vue';
import api from '@/api/api.js';
import UserNotificationCard from '@/components/UserNotificationCard/UserNotificationCard.vue';
import { UserNotification } from '@/types/user-notification/user-notification';
import { captureException } from '@sentry/vue';

defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{ notificationId: number }>();

const currentNotification = ref<UserNotification | null>(null);

const previewIsLoading = ref(false);

async function fetchNotification() {
    previewIsLoading.value = true;

    try {
        currentNotification.value = await api.userNotifications.get(props.notificationId);

        previewIsLoading.value = false;
    } catch (e) {
        captureException(e);
    }
}

onBeforeMount(fetchNotification);

function onUpdated(notification: UserNotification) {
    if (currentNotification.value) {
        Object.assign(currentNotification.value, notification);
    }
}
</script>
