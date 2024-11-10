<template>
    <div
        :id="'message-' + message.id"
        ref="target"
        class="messenger-chat-message messenger-chat-message--system"
        :class="classList"
    >
        <MessengerChatMessageReplyInfo
            v-if="reply"
            @cancel="$emit('cancel-reply')"
            class="mb-2 ml-auto"
        />
        <div class="messenger-chat-message__wrapper position-relative">
            <Loader v-if="isDeleteLoading" class="absolute-center" small />
            <div class="messenger-chat-message__content hover-actions-trigger">
                <MessengerChatMessageActions
                    @pin="pinMessage"
                    @delete="deleteMessage"
                    @reply="$emit('reply')"
                    :message="message"
                    :pinned="pinned"
                    :editable="false"
                />
                <MessengerChatMessageReply v-if="message.reply_to_id" :message="message.reply_to" />
                <MessengerChatMessageAdditions
                    :tasks="message.tasks"
                    :notifications="message.notifications"
                    :surveys="message.surveys"
                />
                <div
                    v-if="message.message"
                    class="messenger-chat-message__body"
                    v-html="message.message"
                ></div>
                <AnimationTransition>
                    <MessengerChatMessageAttachments
                        v-if="message.files.length"
                        :files="message.files"
                    />
                </AnimationTransition>
                <div class="messenger-chat-message__footer">
                    <i v-if="pinned" class="fa-solid fa-lock messenger-chat-message__pinned" />
                    <span>Системное сообщение, </span>
                    <span v-tippy="originalDate" class="messenger-chat-message__date">
                        {{ formattedDate }},
                    </span>
                    <span v-if="message.contacts.length">
                        с
                        <a
                            @click.prevent="changeRecipient"
                            href="#"
                            class="messenger-chat-message__recipient"
                        >
                            {{ recipientUsername }}
                        </a>
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
import { computed, provide, ref, useTemplateRef } from 'vue';
import MessengerChatMessageReplyInfo from '@/components/Messenger/Chat/Message/MessengerChatMessageReplyInfo.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageReply from '@/components/Messenger/Chat/Message/MessengerChatMessageReply.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import MessengerChatMessageActions from '@/components/Messenger/Chat/Message/MessengerChatMessageActions.vue';
import { ucFirst } from '@/utils/formatter.js';
import { entityOptions } from '@/const/options/options.js';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import { useIntersectionObserver, useTimeoutFn } from '@vueuse/core';

const emit = defineEmits(['deleted', 'reply', 'cancel-reply', 'viewed']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    },
    reply: {
        type: Boolean,
        default: true
    },
    canBeViewed: {
        type: Boolean,
        default: false
    }
});

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

provide('$messageID', props.message.id);

const isDeleteLoading = ref(false);
const isViewed = ref(props.message.is_viewed);
const target = useTemplateRef('target');

const classList = computed(() => {
    return {
        'messenger-chat-message--not-viewed': !props.message.is_viewed && !isViewed.value,
        'messenger-chat-message--reply': props.reply
    };
});

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

const changeRecipient = () => {
    store.commit('Messenger/setCurrentRecipient', { contactID: props.message.contacts[0].id });
    notify.info(`Контакт изменен на ${recipientUsername.value}`, 'Выбор контакта');
};

const pinMessage = async () => {
    if (props.pinned) {
        const unpinned = await store.dispatch('Messenger/unpinMessage');
        if (unpinned) notify.success('Сообщение успешно откреплено');
    } else {
        const pinned = await store.dispatch('Messenger/pinMessage', props.message);
        if (pinned) notify.success('Сообщение успешно закреплено');
    }
};

const deleteMessage = async () => {
    const confirmed = await confirm('Вы действительно хотите удалить сообщение?');
    if (!confirmed) return;

    isDeleteLoading.value = true;

    const deleted = await api.messenger.deleteMessage(props.message.id);
    if (deleted) {
        if (props.pinned) pinMessage();
        notify.success('Сообщение успешно удалено');
        emit('deleted');
    }

    isDeleteLoading.value = false;
};

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
</script>
