<template>
    <div class="task-card__relations">
        <div v-if="task.related_by?.chat_member_id" class="task-card__relation">
            <p class="task-card__label mb-1">Привязано к чату:</p>
            <component
                :is="currentDialogComponent"
                @click="$emit('to-chat')"
                :model="task.related_by.chat_member.model"
            />
            <div class="task-card__buttons mt-1">
                <TaskCardButton @click="$emit('to-chat')" bordered>
                    <span>Перейти в чат</span>
                    <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                </TaskCardButton>
                <TaskCardButton v-if="companyId" @click.prevent="$emit('to-company')" bordered>
                    <span>Просмотреть компанию</span>
                    <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                </TaskCardButton>
                <TaskCardContactsTippy v-if="companyId" :company-id="companyId" :task="task" />
            </div>
        </div>
        <div v-if="task.related_by?.chat_member_message_id" class="task-card__relation">
            <p class="task-card__label mb-1">Привязано к сообщению в чате:</p>
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
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import TaskCardContactsTippy from '@/components/TaskCard/TaskCardContactsPreview.vue';
import MessengerChatShortNotification from '@/components/Messenger/Chat/Notification/MessengerChatShortNotification.vue';

defineEmits(['to-chat', 'to-company']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    companyId: {
        type: [Number, null],
        required: true
    }
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
