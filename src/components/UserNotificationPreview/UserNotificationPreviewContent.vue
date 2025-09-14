<template>
    <div class="user-notification-preview">
        <template v-if="previewIsLoading">
            <slot name="fallback">
                <Spinner label="Загрузка уведомления.." class="absolute-center" />
            </slot>
        </template>
        <template v-else-if="currentNotification">
            <UserNotificationCard
                @updated="onUpdated"
                @close="$emit('close')"
                @acted="$emit('acted')"
                :notification="currentNotification"
            >
                <template #additional-actions>
                    <slot name="additional-actions" />
                </template>
            </UserNotificationCard>
            <transition name="actions-fade" appear>
                <div
                    v-if="currentNotification.actions.length"
                    class="user-notification-preview__actions"
                >
                    <div class="user-notification-preview-actions">
                        <div class="user-notification-preview-actions__header">
                            <p class="user-notification-preview-actions__title">Действия</p>
                        </div>
                        <div class="user-notification-preview-actions__list">
                            <UserNotificationCardAction
                                v-for="action in currentNotification.actions"
                                :key="action.id"
                                :action="action"
                            />
                        </div>
                    </div>
                </div>
            </transition>
        </template>
    </div>
</template>
<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import { onBeforeMount, ref } from 'vue';
import api from '@/api/api.js';
import UserNotificationCard from '@/components/UserNotificationCard/UserNotificationCard.vue';
import { UserNotification } from '@/types/user-notification/user-notification';
import { captureException } from '@sentry/vue';
import UserNotificationCardAction from '@/components/UserNotificationCard/UserNotificationCardAction.vue';

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'acted'): void;
    (e: 'updated', notification: UserNotification): void;
}>();

const props = defineProps<{
    notificationId: number;
}>();

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

    emit('updated', notification);
}
</script>
<style>
.actions-fade-enter-active,
.actions-fade-leave-active {
    transition: opacity 0.6s ease;
}

.actions-fade-enter-from,
.actions-fade-leave-to {
    opacity: 0;
}
</style>
