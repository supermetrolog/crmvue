<template>
    <div class="user-notification-card__header">
        <Avatar
            v-if="notification.createdBy"
            :src="notification.createdBy.userProfile.avatar"
            :label="`Отправитель - ${notification.createdBy.userProfile.medium_name}`"
            :size="30"
        />
        <i v-else class="fa-solid fa-bell user-notification-card__icon" />
        <UiField color="light">{{ createdAt }}</UiField>
        <UiField v-if="notification.template" color="light" tooltip="Категория">
            {{ categoryLabel }}
        </UiField>
        <UiField v-if="priorityIsVisible" :color="priorityColor" tooltip="Приоритет">
            {{ priorityLabel }}
        </UiField>
        <UiButtonIcon
            @click="$emit('close')"
            color="light"
            icon="fa-solid fa-xmark"
            class="ml-auto"
            label="Закрыть"
            small
        />
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import UiField from '@/components/common/UI/UiField.vue';
import { computed } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import Avatar from '@/components/common/Avatar.vue';

defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{ notification: UserNotification }>();

const createdAt = computed(() => toBeautifulDateFormat(props.notification.created_at));

const categoryLabel = computed(() => props.notification.template!.category_label);

const priorityLabel = computed(() => props.notification.template!.priority_label);

const priorityColorMap = {
    low: 'light',
    normal: 'light',
    high: 'danger-light',
    urgent: 'danger'
} as const;

const priorityColor = computed(() => priorityColorMap[props.notification.template!.priority]);

const priorityIsVisible = computed(
    () => props.notification.template && props.notification.template.priority !== 'low'
);
</script>
