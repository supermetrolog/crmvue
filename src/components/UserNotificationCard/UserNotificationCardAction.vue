<template>
    <UiButton small :icon :color>
        {{ action.label }}
    </UiButton>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { UserNotificationAction } from '@/types/user-notification/user-notification-action';
import { computed } from 'vue';

const props = defineProps<{ action: UserNotificationAction }>();

const iconMap: Record<string, string> = {
    'external-link': 'fa-solid fa-external-link',
    task: 'fa-solid fa-bolt',
    reply: 'fa-solid fa-reply'
} as const;

const styleMap: Record<string, string> = {
    light: 'light'
} as const;

const icon = computed(() => (props.action.icon ? iconMap[props.action.icon] : undefined));
const color = computed(() => (props.action.style ? styleMap[props.action.style] : undefined));
</script>
