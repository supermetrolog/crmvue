<template>
    <div class="header-summary-user-notifications">
        <div class="header-summary-user-notifications__tabs">
            <UiButton
                @click="currentTab = 'new'"
                :color="currentTab === 'new' ? 'success-light' : 'light'"
            >
                <span>Новые</span>
                <span class="mx-1 text-grey op-7">·</span>
                <span>{{ count }}</span>
            </UiButton>
            <UiButton
                @click="currentTab = 'old'"
                :color="currentTab === 'old' ? 'success-light' : 'light'"
            >
                Обработанные
            </UiButton>
        </div>
        <HeaderSummaryUserNotificationsContentList
            v-show="currentTab === 'new'"
            @load="onLoadNotActedNotifications"
            :notifications="notActedNotifications"
            :loading="isLoading"
        >
            <template #item="{ notification }">
                <UserNotificationInlineCard
                    @click="showUserNotification(notification.id)"
                    :notification="notification"
                    is-new
                />
            </template>
        </HeaderSummaryUserNotificationsContentList>
        <HeaderSummaryUserNotificationsContentList
            v-show="currentTab === 'old'"
            @load="onLoadOldNotifications"
            @select="showUserNotification"
            :notifications="oldNotifications"
            :loading="oldNotificationsIsLoading"
        />
        <teleport to="body">
            <UserNotificationPreview
                v-model:visible="previewIsVisible"
                @closed="onClosePreview"
                @updated="onUpdated"
                :notification-id="viewingUserNotificationId"
            />
        </teleport>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import UserNotificationInlineCard from '@/components/UserNotificationInlineCard/UserNotificationInlineCard.vue';
import UserNotificationPreview from '@/components/UserNotificationPreview/UserNotificationPreview.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import {
    ShortUserNotification,
    UserNotification
} from '@/types/user-notification/user-notification';
import HeaderSummaryUserNotificationsContentList, {
    InfiniteLoadingState
} from '@/components/Header/Summary/HeaderSummaryUserNotificationsContentList.vue';

defineEmits<{ (e: 'close'): void }>();

withDefaults(defineProps<{ count: number }>(), { count: 0 });

const { currentUserId } = useAuth();

// tabs

type NotificationTab = 'new' | 'old';

const currentTab = ref<NotificationTab>('new');

const isLoading = ref(false);

const notActedNotifications = ref<ShortUserNotification[]>([]);

async function fetchNotActedNotifications() {
    isLoading.value = true;

    notActedNotifications.value = await api.userNotifications.load({
        acted: 0,
        expired: 0,
        user_id: currentUserId.value
    });

    isLoading.value = false;
}

onBeforeMount(fetchNotActedNotifications);

const isNextLoading = ref(false);

async function onLoadNotActedNotifications($state: InfiniteLoadingState) {
    if (isNextLoading.value) {
        return;
    }

    isNextLoading.value = true;

    const response = await api.userNotifications.load({
        acted: 0,
        expired: 0,
        user_id: currentUserId.value,
        id_less_then: notActedNotifications.value.at(-1)?.id
    });

    notActedNotifications.value.push(...response);

    if (response.length < 20) {
        $state.complete();
    } else {
        $state.loaded();
    }

    isNextLoading.value = false;
}

// old notifications

const oldNotificationsIsLoading = ref(false);
const oldNotifications = ref<ShortUserNotification[]>([]);

async function fetchOldNotifications() {
    oldNotificationsIsLoading.value = true;

    oldNotifications.value = await api.userNotifications.load({
        processed: 1,
        user_id: currentUserId.value
    });

    oldNotificationsIsLoading.value = false;
}

const stopWatchOldNotifications = watch(currentTab, value => {
    if (value === 'old') {
        fetchOldNotifications();
        stopWatchOldNotifications();
    }
});

const olsNotificationsIsNextLoading = ref(false);

async function onLoadOldNotifications($state: InfiniteLoadingState) {
    if (olsNotificationsIsNextLoading.value) {
        return;
    }

    olsNotificationsIsNextLoading.value = true;

    const response = await api.userNotifications.load({
        processed: 1,
        user_id: currentUserId.value,
        id_less_then: oldNotifications.value.at(-1)?.id
    });

    oldNotifications.value.push(...response);

    if (response.length < 20) {
        $state.complete();
    } else {
        $state.loaded();
    }

    olsNotificationsIsNextLoading.value = false;
}

const previewIsVisible = ref(false);
const viewingUserNotificationId = ref<number | null>(null);

function showUserNotification(notificationId: number) {
    viewingUserNotificationId.value = notificationId;
    previewIsVisible.value = true;
}

function onClosePreview() {
    viewingUserNotificationId.value = null;
}

function onUpdated(notification: UserNotification) {
    const currentNotification = notActedNotifications.value.find(n => n.id === notification.id);

    if (currentNotification) {
        Object.assign(currentNotification, notification);
    }
}
</script>
