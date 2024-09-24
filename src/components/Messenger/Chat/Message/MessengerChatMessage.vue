<template>
    <div :id="'message-' + message.id" class="messenger-chat-message" :class="classList">
        <div class="messenger-chat-message__wrapper position-relative">
            <Loader v-if="isDeleteLoading" class="absolute-center" small />
            <Avatar v-if="!self" :src="message.from.model.userProfile.avatar" size="55" />
            <div class="messenger-chat-message__content hover-actions-trigger">
                <MessengerChatMessageActions
                    @pin="pinMessage"
                    @edit="editMessage"
                    @pin-to-object="pinToObject"
                    @delete="deleteMessage"
                    :message="message"
                    :pinned="pinned"
                />
                <MessengerChatMessageAdditions
                    :tasks="message.tasks"
                    :notifications="message.notifications"
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
                    <span>{{ username }}, </span>
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
import { useStore } from 'vuex';
import { entityOptions } from '@/const/options/options';
import Avatar from '@/components/common/Avatar.vue';
import MessengerChatMessageActions from '@/components/Messenger/Chat/Message/MessengerChatMessageActions.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import { computed, inject, provide, shallowRef } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import { ucFirst } from '@/utils/formatter.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const $messageUpdate = inject('$messageUpdate');

const emit = defineEmits(['deleted']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    self: {
        type: Boolean,
        default: false
    },
    pinned: {
        type: Boolean,
        default: false
    }
});

provide('$messageID', props.message.id);

const isDeleteLoading = shallowRef(false);

const originalDate = computed(() => {
    return props.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
});
const formattedDate = computed(() => {
    return props.message.dayjs_date.format('H:mm');
});

const classList = computed(() => {
    return {
        'messenger-chat-message--right': props.self,
        'messenger-chat-message--not-viewed': !props.message.is_viewed
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
const editMessage = async () => {
    const updated = await $messageUpdate(props.message);
    if (updated) notify.success('Сообщение успешно обновлено');
};
const pinToObject = async () => {
    const pinned = await store.dispatch('Messenger/pinMessageToObject', props.message);

    if (pinned) {
        notify.success(
            props.message.pinnedToObject
                ? 'Сообщение успешно закреплено за объектом'
                : 'Сообщение успешно откреплено от объекта'
        );
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз');
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
</script>
