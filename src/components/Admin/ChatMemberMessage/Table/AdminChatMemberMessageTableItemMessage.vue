<template>
    <div class="messenger-chat-message">
        <div class="messenger-chat-message__wrapper position-relative">
            <div class="messenger-chat-message__content hover-actions-trigger">
                <MessengerChatMessageActions @delete="$emit('delete')" :message="message">
                    <HoverActionsButton @click="$emit('pin-to-entity')" label="Закрепить в таблице">
                        <i class="fa-solid fa-table"></i>
                    </HoverActionsButton>
                    <HoverActionsButton @click="$emit('delete')" label="Удалить">
                        <i class="fa-solid fa-trash"></i>
                    </HoverActionsButton>
                </MessengerChatMessageActions>
                <MessengerChatMessageReply v-if="message.reply_to_id" :message="message.reply_to" />
                <MessengerChatMessageAdditions
                    :tasks="message.tasks"
                    :notifications="message.notifications"
                    :surveys="message.surveys"
                />
                <MessengerChatMessageTemplate
                    v-if="message.template"
                    :template="message.template"
                    :message
                />
                <div
                    v-else-if="message.message"
                    ref="messageElement"
                    class="messenger-chat-message__body"
                ></div>
                <AnimationTransition>
                    <MessengerChatMessageAttachments
                        v-if="message.files.length"
                        :files="message.files"
                    />
                </AnimationTransition>
                <div class="messenger-chat-message__footer">
                    <span>{{ message.from.model.userProfile.short_name }}, </span>
                    <span v-tippy="originalDate" class="messenger-chat-message__date">
                        {{ formattedDate }},
                    </span>
                    <span v-if="message.contacts.length">
                        с
                        <span class="messenger-chat-message__recipient">
                            {{ recipientUsername }}
                        </span>
                    </span>
                    <span v-else>без звонка</span>
                    <template v-if="message.tags.length">
                        <span>, </span>
                        <span class="messenger-chat-message__categories">
                            {{ categories }}
                        </span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import MessengerChatMessageTemplate from '@/components/Messenger/Chat/Message/MessengerChatMessageTemplate.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import MessengerChatMessageReply from '@/components/Messenger/Chat/Message/MessengerChatMessageReply.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import { computed, toRef, useTemplateRef } from 'vue';
import { dayjsFromServer } from '@/utils/formatters/date.ts';
import { entityOptions } from '@/const/options/options.js';
import { ucFirst } from '@/utils/formatters/string.js';
import { useLinkify } from '@/composables/useLinkify.js';
import MessengerChatMessageActions from '@/components/Messenger/Chat/Message/MessengerChatMessageActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

defineEmits(['delete', 'pin-to-entity']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const messageDayjsDate = computed(() => {
    return props.message.dayjs_date ?? dayjsFromServer(props.message.created_at);
});

const originalDate = computed(() => {
    return messageDayjsDate.value.format('D MMMM YYYY., H:mm:ss');
});

const formattedDate = computed(() => {
    return messageDayjsDate.value.format('H:mm');
});

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
});

const categories = computed(() => {
    return props.message.tags.map(element => ucFirst(element.name)).join(', ');
});

// message linkify

useLinkify(toRef(props.message, 'message'), useTemplateRef('messageElement'));
</script>
