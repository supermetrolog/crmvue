<template>
    <div class="user-notification-card__footer">
        <UiButton
            @click="markAsActed"
            :disabled="isActed || !canBeActed"
            :state="actState.state?.value"
            :icon="isActed ? 'fa-solid fa-check-double' : 'fa-solid fa-check'"
            :color="isActed ? 'light' : 'success-light'"
        >
            <span class="mr-1">{{ actLabel }}</span>
            <span v-if="isActed">{{ actedAt }}</span>
        </UiButton>
        <slot name="additional" />
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import api from '@/api/api';
import UiButton from '@/components/common/UI/UiButton.vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import { genderize } from '@/utils/genderize';
import { useButtonState } from '@/composables/useButtonState';
import { captureException } from '@sentry/vue';

const emit = defineEmits<{
    (e: 'acted', notification: UserNotification): void;
}>();

const props = defineProps<{ notification: UserNotification }>();

const { currentUser } = useAuth();

const canBeActed = computed(() => props.notification.user_id === currentUser.value.id);

const isActed = computed(() => isNotNullish(props.notification.acted_at));
const actedAt = computed(() => toBeautifulDateFormat(props.notification.acted_at).toLowerCase());

const actLabel = computed(() => genderize(currentUser.value, 'Ознакомился', 'Ознакомилась'));

const actState = useButtonState();

async function markAsActed() {
    actState.loading();

    try {
        const response = await api.userNotifications.acted(props.notification.id);

        emit('acted', response);

        actState.success();
    } catch (error) {
        captureException(error);

        actState.error();
    }
}
</script>
