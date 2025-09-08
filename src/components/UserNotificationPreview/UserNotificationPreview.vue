<template>
    <UiModal
        v-model:visible="visible"
        @closed="$emit('closed')"
        title="Просмотр уведомления"
        :blackout-opacity="0.5"
    >
        <template #container="{ close }">
            <UserNotificationPreviewContent :key="notificationId" @close="close" :notification-id />
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import UiModal from '@/components/common/UI/UiModal.vue';
import UserNotificationPreviewContent from '@/components/UserNotificationPreview/UserNotificationPreviewContent.vue';

const visible = defineModel<boolean>('visible');

defineEmits<{ (e: 'closed'): void }>();

defineProps<{ notificationId: number | null }>();
</script>
