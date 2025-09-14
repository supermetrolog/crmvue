<template>
    <div class="user-notification-card-template">
        <component :is="template" :notification />
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import { computed } from 'vue';
import UserNotificationCardTemplateChangeCompanyConsultant from '@/components/UserNotificationCard/Template/UserNotificationCardTemplateChangeCompanyConsultant.vue';
import UserNotificationCardTemplateBase from '@/components/UserNotificationCard/Template/UserNotificationCardTemplateBase.vue';
import UserNotificationCardTemplateChangeRequestConsultant from '@/components/UserNotificationCard/Template/UserNotificationCardTemplateChangeRequestConsultant.vue';
import UserNotificationCardTemplateCreateTaskComment from '@/components/UserNotificationCard/Template/UserNotificationCardTemplateCreateTaskComment.vue';

const props = defineProps<{ notification: UserNotification }>();

const TEMPLATES = {
    'change-company-consultant': UserNotificationCardTemplateChangeCompanyConsultant,
    'change-request-consultant': UserNotificationCardTemplateChangeRequestConsultant,
    'create-task-comment': UserNotificationCardTemplateCreateTaskComment
} as const;

const template = computed(
    () => TEMPLATES[props.notification.template!.kind] ?? UserNotificationCardTemplateBase
);
</script>
