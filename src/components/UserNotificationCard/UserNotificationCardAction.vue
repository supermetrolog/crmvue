<template>
    <UiButton @click="handleAction" small :icon :color>
        {{ action.label }}
    </UiButton>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { UserNotificationAction } from '@/types/user-notification/user-notification-action';
import { computed } from 'vue';
import api from '@/api/api';
import { useNotify } from '@/utils/use/useNotify';
import { useRouter } from 'vue-router';

const props = defineProps<{ action: UserNotificationAction }>();

const iconMap: Record<string, string> = {
    'external-link': 'fa-solid fa-external-link'
} as const;

const styleMap: Record<string, string> = {
    light: 'light'
} as const;

const routeMap: Record<string, string> = {
    'company.view': 'company'
} as const;

const icon = computed(() => (props.action.icon ? iconMap[props.action.icon] : undefined));
const color = computed(() => (props.action.style ? styleMap[props.action.style] : undefined));

const notify = useNotify();

function processAction() {
    api.userNotifications.processAction(props.action.user_notification_id, props.action.id);
}

const router = useRouter();

function resolveRoute() {
    if (props.action.payload?.route_code) {
        return router.resolve({
            name: routeMap[props.action.payload?.route_code],
            params: props.action.payload?.params,
            query: props.action.payload?.query
        }).href;
    }

    if (props.action.payload?.fallback_url) {
        return props.action.payload?.fallback_url;
    }

    return null;
}

function handleAction() {
    processAction();

    // TODO: Динамическое построение action с разными handle

    if (props.action.type === 'navigate') {
        window.open(resolveRoute(), '_blank');
    } else {
        notify.info('Функция в доработке..');
    }
}
</script>
