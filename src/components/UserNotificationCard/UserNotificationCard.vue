<template>
    <div class="user-notification-card">
        <div class="user-notification-card__header">
            <UiField color="light">#{{ notification.id }}</UiField>
            <UiField color="light">{{ createdAt }}</UiField>
            <UiField v-if="notification.template" color="light">{{ category }}</UiField>
            <UiField color="light">{{ notification.subject }}</UiField>
        </div>
        <div class="user-notification-card__content">
            <p class="user-notification-card__message">{{ notification.message }}</p>
        </div>
        <div class="user-notification-card__actions">
            <UiButton
                @click="markAsActed"
                :disabled="isActed"
                :state="actState.state?.value"
                small
                :icon="isActed ? 'fa-solid fa-check-double' : 'fa-solid fa-check'"
                :color="isActed ? 'light' : 'success-light'"
            >
                <span class="mr-1">{{ actLabel }}</span>
                <span v-if="isActed">{{ actedAt }}</span>
            </UiButton>
            <span class="op-5 text-grey">|</span>
            <UserNotificationCardAction
                v-for="action in notification.actions"
                :key="action.id"
                :action="action"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import UiField from '@/components/common/UI/UiField.vue';
import { computed, onMounted } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import UiButton from '@/components/common/UI/UiButton.vue';
import { genderize } from '@/utils/genderize';
import { useAuth } from '@/composables/useAuth';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import api from '@/api/api';
import { captureException } from '@sentry/vue';
import { useButtonState } from '@/composables/useButtonState';
import UserNotificationCardAction from '@/components/UserNotificationCard/UserNotificationCardAction.vue';

const emit = defineEmits<{ (e: 'updated', notification: UserNotification): void }>();
const props = defineProps<{ notification: UserNotification }>();

const createdAt = computed(() => toBeautifulDateFormat(props.notification.created_at));

const { currentUser } = useAuth();

const category = computed(() => props.notification.template?.category);

const isViewed = computed(() => isNotNullish(props.notification.viewed_at));

// act

const isActed = computed(() => isNotNullish(props.notification.acted_at));
const actedAt = computed(() => toBeautifulDateFormat(props.notification.acted_at).toLowerCase());

const actLabel = computed(() => genderize(currentUser.value, 'Ознакомился', 'Ознакомилась'));

const actState = useButtonState();

async function markAsActed() {
    actState.loading();

    try {
        const response = await api.userNotifications.acted(props.notification.id);

        emit('updated', response);

        actState.success();
    } catch (error) {
        captureException(error);

        actState.error();
    }
}

const canBeViewed = computed(
    () => !isViewed.value && props.notification.user_id === currentUser.value?.id
);

onMounted(() => {
    if (canBeViewed.value) {
        markAsViewed();
    }
});

async function markAsViewed() {
    const response = await api.userNotifications.viewed(props.notification.id);

    emit('updated', response);
}
</script>
