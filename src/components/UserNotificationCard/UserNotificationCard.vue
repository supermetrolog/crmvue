<template>
    <div class="user-notification-card">
        <UserNotificationCardHeader @close="$emit('close')" :notification />
        <div class="user-notification-card__content">
            <p class="user-notification-card__subject">
                <span>{{ notification.subject }}</span>
            </p>
            <p class="user-notification-card__message">{{ notification.message }}</p>
        </div>
        <UserNotificationCardTemplate v-if="notification.template" :notification />
        <UserNotificationCardFooter @acted="onActed" :notification>
            <template #additional>
                <slot name="additional-actions" />
            </template>
        </UserNotificationCardFooter>
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import { computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import api from '@/api/api';
import UserNotificationCardHeader from '@/components/UserNotificationCard/UserNotificationCardHeader.vue';
import { useUserNotificationsBus } from '@/composables/useUserNotificationsBus';
import UserNotificationCardFooter from '@/components/UserNotificationCard/UserNotificationCardFooter.vue';
import UserNotificationCardTemplate from '@/components/UserNotificationCard/Template/UserNotificationCardTemplate.vue';

const emit = defineEmits<{
    (e: 'updated', notification: UserNotification): void;
    (e: 'close'): void;
    (e: 'acted'): void;
}>();

const props = defineProps<{ notification: UserNotification }>();

const { currentUser } = useAuth();

const isViewed = computed(() => isNotNullish(props.notification.viewed_at));

// act

const canBeViewed = computed(
    () => !isViewed.value && props.notification.user_id === currentUser.value?.id
);

onMounted(() => {
    if (canBeViewed.value) {
        markAsViewed();
    }
});

const notificationsBus = useUserNotificationsBus();

async function markAsViewed() {
    const response = await api.userNotifications.viewed(props.notification.id);

    emit('updated', response);

    notificationsBus.emit({ type: 'viewed', id: props.notification.id });
}

function onActed(notification: UserNotification) {
    emit('acted');
    emit('updated', notification);
    notificationsBus.emit({ type: 'acted', id: props.notification.id });
}
</script>
