<template>
    <notifications position="top right" group="user-notifications" pause-on-hover :width="450">
        <template #body="{ item, close }">
            <div class="vue-notification-template vue-notification info app-user-notification">
                <div class="notification-title app-user-notification-title">
                    <i class="fa-solid fa-bell fs-4" />
                    <span>{{ item.title }}</span>
                </div>
                <div class="notification-content app-user-notification-content">
                    {{ item.text }}
                </div>
                <UiButton
                    @click="showUserNotification(item.data?.notification_id, close)"
                    class="mt-2 app-user-notification-button"
                    icon="fa-solid fa-external-link"
                    color="white"
                    tooltip="Нажмите, чтобы открыть уведомление"
                >
                    Просмотреть
                </UiButton>
            </div>
        </template>
    </notifications>
    <teleport to="body">
        <UserNotificationPreview
            v-model:visible="previewIsVisible"
            @closed="onClosePreview"
            :notification-id="viewingUserNotificationId"
        />
    </teleport>
</template>

<script setup lang="ts">
import { Notifications } from '@kyvg/vue3-notification';
import { ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UserNotificationPreview from '@/components/UserNotificationPreview/UserNotificationPreview.vue';

const previewIsVisible = ref(false);

const viewingUserNotificationId = ref<number | null>(null);

function showUserNotification(notificationId: number, closeCb: () => void) {
    closeCb();

    viewingUserNotificationId.value = notificationId;
    previewIsVisible.value = true;
}

function onClosePreview() {
    viewingUserNotificationId.value = null;
}
</script>
<style>
.app-user-notification-title {
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.app-user-notification-content {
    font-size: 15px;
}

.app-user-notification-button {
    font-size: 14px;
    padding: 5px 10px !important;
}
</style>
