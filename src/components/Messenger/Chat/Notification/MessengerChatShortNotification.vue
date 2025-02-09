<template>
    <div
        class="messenger-chat-message messenger-chat-message--system messenger-chat-message--not-viewed"
    >
        <div class="messenger-chat-message__wrapper position-relative">
            <div class="messenger-chat-message__content hover-actions-trigger">
                <MessengerChatNotificationTemplate
                    v-if="message.template"
                    :template="message.template"
                    :message
                    short
                />
                <template v-else>
                    <div
                        v-if="message.message"
                        ref="messageElement"
                        class="messenger-chat-message__body"
                    ></div>
                </template>
                <AnimationTransition>
                    <MessengerChatMessageAttachments
                        v-if="message.files.length"
                        :files="message.files"
                    />
                </AnimationTransition>
                <div class="messenger-chat-message__footer">
                    <span>Системное сообщение, </span>
                    <span v-tippy="originalDate" class="messenger-chat-message__date">
                        {{ formattedDate }},
                    </span>
                    <span v-if="message.contacts.length">
                        с
                        <span class="messenger-chat-message__recipient">
                            {{ recipientUsername }}
                        </span>
                    </span>
                    <span v-else>без контакта</span>
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
import { computed, provide, toRef, useTemplateRef } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { entityOptions } from '@/const/options/options.js';
import MessengerChatNotificationTemplate from '@/components/Messenger/Chat/Notification/MessengerChatNotificationTemplate.vue';
import { useLinkify } from '@/composables/useLinkify.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

provide('$messageID', props.message.id);

const originalDate = computed(() => {
    return props.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
});
const formattedDate = computed(() => {
    return props.message.dayjs_date.format('H:mm');
});

const categories = computed(() => {
    return props.message.tags.map(element => ucFirst(element.name)).join(', ');
});

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
});

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
