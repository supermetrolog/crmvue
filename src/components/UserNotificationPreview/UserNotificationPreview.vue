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
                @acted="onActed"
                @updated="$emit('updated', $event)"
                @close="close"
                :notification-id="notificationId"
            >
                <template v-if="isActed" #additional-actions>
                    <UiButton @click="close" color="light" icon="fa-solid fa-ban">
                        Закрыть
                    </UiButton>
                </template>
            </UserNotificationPreviewContent>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import UiModal from '@/components/common/UI/UiModal.vue';
import UserNotificationPreviewContent from '@/components/UserNotificationPreview/UserNotificationPreviewContent.vue';
import { UserNotification } from '@/types/user-notification/user-notification';
import UiButton from '@/components/common/UI/UiButton.vue';
import { ref, watch } from 'vue';

const visible = defineModel<boolean>('visible');

defineEmits<{
    (e: 'closed'): void;
    (e: 'updated', notification: UserNotification): void;
}>();

const props = defineProps<{
    notificationId: number | null;
}>();

const isActed = ref(false);

watch(
    () => props.notificationId,
    () => {
        isActed.value = false;
    }
);

function onActed() {
    isActed.value = true;
}
</script>
