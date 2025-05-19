<template>
    <div class="task-card__relations">
        <div v-if="task.related_by?.chat_member_id" class="task-card__relation">
            <p class="task-card__label mb-1">Закреплено</p>
            <component
                :is="currentDialogComponent"
                @click="$emit('to-chat')"
                :model="task.related_by.chat_member.model"
            />
            <UiDropdownActions
                class="task-card__relations-dropdown"
                menu-class="task-card__dropdown"
            >
                <template #trigger>
                    <UiButtonIcon
                        class="dashboard-bg-primary-l"
                        small
                        label="Подробнее"
                        icon="fa-solid fa-ellipsis"
                    />
                </template>
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('to-chat')"
                        label="Перейти в чат"
                        icon="fa-solid fa-comment-alt"
                    />
                    <UiDropdownActionsButton
                        v-if="companyId"
                        @handle="$emit('to-company')"
                        label="Просмотреть компанию"
                        icon="fa-solid fa-arrow-up-right-from-square"
                    />
                    <UiDropdownActionsButton
                        v-if="companyId"
                        @handle="$emit('show-contacts')"
                        label="Список контактов"
                        icon="fa-solid fa-contact-card"
                    />
                </template>
            </UiDropdownActions>
        </div>
        <div
            v-if="task.related_by?.chat_member_message_id"
            class="task-card__relation task-card__relation-message"
        >
            <MessengerChatShortNotification
                v-if="chatMemberMessage.is_system"
                class="task-card__chat-notification"
                :message="chatMemberMessage"
            />
            <MessengerChatShortMessage
                v-else
                class="task-card__chat-message"
                :message="chatMemberMessage"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import MessengerChatShortMessage from '@/components/Messenger/Chat/Message/MessengerChatShortMessage.vue';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { messenger } from '@/const/messenger.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import MessengerChatShortNotification from '@/components/Messenger/Chat/Notification/MessengerChatShortNotification.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['to-chat', 'to-company', 'show-contacts']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    companyId: Number
});

const chatMemberMessage = computed(() => {
    const message = props.task.related_by.chat_member_message;
    message.dayjs_date = dayjsFromMoscow(message.created_at);
    return message;
});

const currentDialogComponent = computed(() => {
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.REQUEST)
        return MessengerDialogRequest;
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.USER)
        return MessengerDialogUser;
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.COMPANY)
        return MessengerDialogCompany;
    return MessengerDialogObject;
});
</script>
