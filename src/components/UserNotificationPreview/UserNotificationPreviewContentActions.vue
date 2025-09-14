<template>
    <div class="user-notification-preview-actions">
        <div class="user-notification-preview-actions__header">
            <p class="user-notification-preview-actions__title">Действия</p>
        </div>
        <div class="user-notification-preview-actions__list">
            <UserNotificationCardAction
                v-for="action in actions"
                :key="action.id"
                @click="handleAction(action)"
                :action="action"
            />
        </div>
        <teleport to="body">
            <TaskPreview
                v-if="hasTaskPreview"
                v-model:visible="taskPreviewIsVisible"
                @closed="closeTaskPreview"
                :task-id="taskPreviewId as number"
                :active-comment-id="taskPreviewCommentId"
                :z-index="6000"
            />
        </teleport>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import api from '@/api/api.js';
import { UserNotification } from '@/types/user-notification/user-notification';
import UserNotificationCardAction from '@/components/UserNotificationCard/UserNotificationCardAction.vue';
import { useUserNotificationsBus } from '@/composables/useUserNotificationsBus';
import { useNotify } from '@/utils/use/useNotify';
import { useRouter } from 'vue-router';
import { UserNotificationAction } from '@/types/user-notification/user-notification-action';
import { useConfirm } from '@/composables/useConfirm';
import { captureEvent } from '@sentry/vue';
import { useAuth } from '@/composables/useAuth';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';

const emit = defineEmits<{
    (e: 'acted'): void;
}>();

const props = defineProps<{
    notification: UserNotification;
}>();

const actions = computed(() => props.notification.actions.toSorted((a, b) => a.order - b.order));

const hasTaskPreview = computed(() =>
    props.notification.relations.some(relation => relation.entity_type === 'task')
);

const notificationsBus = useUserNotificationsBus();

const canBeActed = computed(
    () =>
        props.notification.user_id === currentUser.value.id &&
        isNullish(props.notification.acted_at)
);

async function markAsActed() {
    const notificationId = props.notification.id;

    await api.userNotifications.acted(notificationId);

    emit('acted');
    notificationsBus.emit({ type: 'acted', id: notificationId });
}

// handling

const routeMap: Record<string, string> = {
    'company.view': 'company'
} as const;

const notify = useNotify();

function handleAction(action: UserNotificationAction) {
    processAction(action);

    if (action.type === 'navigate') {
        window.open(resolveRoute(action), '_blank');
    } else {
        dispatchCommand(action);
    }
}

function processAction(action: UserNotificationAction) {
    api.userNotifications.processAction(action.user_notification_id, action.id);

    if (canBeActed.value) {
        markAsActed();
    }
}

const router = useRouter();

function resolveRoute(action: UserNotificationAction) {
    if (action.payload?.route_code) {
        return router.resolve({
            name: routeMap[action.payload?.route_code],
            params: action.payload?.params,
            query: action.payload?.query
        }).href;
    }

    if (action.payload?.fallback_url) {
        return action.payload?.fallback_url;
    }

    return null;
}

const { confirm } = useConfirm();
const { currentUser } = useAuth();

type CommandPayload<T extends Record<string, string | number>> = T;

type OpenTaskActionPayload = {
    task_id: number;
    task_comment_id?: number;
    focus?: string;
};

const handlers = {
    open_task_comment(payload: CommandPayload<OpenTaskActionPayload>) {
        taskPreviewId.value = payload.task_id;

        taskPreviewIsVisible.value = true;
    },
    reply_task_comment(payload: CommandPayload<OpenTaskActionPayload>) {
        taskPreviewId.value = payload.task_id;
        taskPreviewCommentId.value = payload.task_comment_id ?? null;

        taskPreviewIsVisible.value = true;
    }
} as const;

async function dispatchCommand(action: UserNotificationAction): Promise<void> {
    const handler = handlers[action.code] ?? null;

    if (!handler) {
        notify.info('Функция в разработке..');

        captureEvent({
            user: currentUser,
            message: 'Unexpected notification action handler',
            extra: { action }
        });

        return;
    }

    if (action.confirmation) {
        const confirmed = await confirm(
            'Подтвердите действие',
            'Вы уверены, что хотите выполнить действие?'
        );
        if (!confirmed) return;
    }

    await handler(action.payload);
}

// task preview

const taskPreviewIsVisible = ref(false);
const taskPreviewId = ref<number | null>(null);
const taskPreviewCommentId = ref<number | null>(null);

function closeTaskPreview() {
    taskPreviewIsVisible.value = false;
    taskPreviewId.value = null;
}
</script>
