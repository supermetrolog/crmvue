<template>
    <UiModal
        v-model:visible="visible"
        @closed="$emit('closed')"
        title="Просмотр уведомления"
        :blackout-opacity="0.75"
    >
        <template #container="{ close }">
            <UserNotificationPreviewContent
                v-if="notificationId"
                :key="notificationId"
                @updated="$emit('updated', $event)"
                @close="close"
                :notification-id="notificationId"
            />
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import UiModal from '@/components/common/UI/UiModal.vue';
import UserNotificationPreviewContent from '@/components/UserNotificationPreview/UserNotificationPreviewContent.vue';
import { UserNotification } from '@/types/user-notification/user-notification';

const visible = defineModel<boolean>('visible');

defineEmits<{
    (e: 'closed'): void;
    (e: 'updated', notification: UserNotification): void;
}>();

defineProps<{
    notificationId: number | null;
}>();
</script>
