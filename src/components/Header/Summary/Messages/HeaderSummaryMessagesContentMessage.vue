<template>
    <div
        :id="'message-' + message.id"
        ref="target"
        class="messenger-chat-message"
        :class="classList"
    >
        <div class="messenger-chat-message__wrapper position-relative">
            <Loader v-if="isDeleteLoading" class="absolute-center" small />
            <Avatar v-if="!self" :src="message.from.model.userProfile.avatar" size="55" />
            <div class="messenger-chat-message__content hover-actions-trigger">
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
                    <i v-if="pinned" class="fa-solid fa-lock messenger-chat-message__pinned" />
                    <span>{{ username }}, </span>
                    <span v-tippy="originalDate" class="messenger-chat-message__date">
                        {{ formattedDate }},
                    </span>
                    <span v-if="message.contacts.length">
                        с
                        <a href="#" class="messenger-chat-message__recipient">
                            {{ recipientUsername }}
                        </a>
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
import { entityOptions } from '@/const/options/options.js';
import Avatar from '@/components/common/Avatar.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import { computed, ref, toRef, useTemplateRef } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import Loader from '@/components/common/Loader.vue';
import MessengerChatMessageReply from '@/components/Messenger/Chat/Message/MessengerChatMessageReply.vue';
import { useIntersectionObserver, useTimeoutFn } from '@vueuse/core';
import MessengerChatMessageTemplate from '@/components/Messenger/Chat/Message/MessengerChatMessageTemplate.vue';
import { useLinkify } from '@/composables/useLinkify.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const emit = defineEmits(['viewed']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    self: Boolean,
    pinned: Boolean,
    reply: Boolean,
    canBeViewed: Boolean
});

const isDeleteLoading = ref(false);

const isViewed = ref(props.message.is_viewed);
const isNewMessage = isNotNullish(props.message.is_viewed) && !props.message.is_viewed;

const target = useTemplateRef('target');

const originalDate = computed(() => {
    return props.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
});

const formattedDate = computed(() => {
    return props.message.dayjs_date.format('H:mm');
});

const classList = computed(() => {
    return {
        'messenger-chat-message--right': props.self,
        'messenger-chat-message--not-viewed': !props.message.is_viewed && !isViewed.value,
        'messenger-chat-message--reply': props.reply,
        'messenger-chat-message--new': isNewMessage
    };
});

const username = computed(() => {
    let _username = props.message.from.model.userProfile.middle_name;

    if (props.message.from.model.userProfile?.first_name)
        _username += ` ${props.message.from.model.userProfile.first_name[0]}.`;
    if (props.message.from.model.userProfile?.last_name)
        _username += ` ${props.message.from.model.userProfile.last_name[0]}.`;

    return _username;
});

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
});

const categories = computed(() => {
    return props.message.tags.map(element => ucFirst(element.name)).join(', ');
});

const viewLocale = () => {
    isViewed.value = true;
};

const { start: delayedViewLocale } = useTimeoutFn(viewLocale, 1200, { immediate: false });

const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
        if (!isIntersecting) return;

        if (props.message.is_viewed) {
            stop();
            return;
        }

        emit('viewed', props.message.id);
        delayedViewLocale();
        stop();
    },
    { immediate: props.canBeViewed }
);

// message linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
