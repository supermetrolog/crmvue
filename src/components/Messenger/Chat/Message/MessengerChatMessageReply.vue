<template>
    <div class="messenger-chat-message messenger-chat-message-reply">
        <DashboardChip v-if="isReplyForMe" class="dashboard-bg-success-l mb-2">
            <i class="fa-solid fa-share mr-2" />
            <span>Ответ на ваше сообщение</span>
        </DashboardChip>
        <div
            class="messenger-chat-message__wrapper position-relative"
            :class="{ deleted: isDeleted }"
        >
            <Avatar :src="message.from.model.userProfile.avatar" size="45" />
            <div v-if="!isDeleted" class="messenger-chat-message__content hover-actions-trigger">
                <AccordionSimple
                    v-if="message.files.length"
                    class="messenger-chat-message-reply__files"
                    without-render
                >
                    <template #title>
                        <AccordionSimpleTriggerButton :label="filesCountText" />
                    </template>
                    <template #body>
                        <MessengerChatMessageAttachments :files="message.files" />
                    </template>
                </AccordionSimple>
                <div
                    v-if="message.message"
                    ref="messageElement"
                    class="messenger-chat-message__body"
                ></div>
                <div class="messenger-chat-message__footer">
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
            <DashboardChip v-else class="dashboard-bg-gray-l">
                Сообщение удалено {{ deletedAt }}..
            </DashboardChip>
        </div>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';
import { computed, toRef, useTemplateRef } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { ucFirst } from '@/utils/formatters/string.js';
import Avatar from '@/components/common/Avatar.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useStore } from 'vuex';
import { useLinkify } from '@/composables/useLinkify.js';
import { usePlural } from '@/composables/usePlural.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const store = useStore();

const originalDate = computed(() =>
    toDateFormat(props.message.created_at, 'D MMMM YYYY., H:mm:ss')
);
const formattedDate = computed(() => toDateFormat(props.message.created_at, 'H:mm'));
const deletedAt = computed(() => toDateFormat(props.message.deleted_at));
const username = computed(() => {
    let _username = props.message.from.model.userProfile.middle_name;

    if (props.message.from.model.userProfile?.first_name)
        _username += ` ${props.message.from.model.userProfile.first_name[0]}.`;
    if (props.message.from.model.userProfile?.last_name)
        _username += ` ${props.message.from.model.userProfile.last_name[0]}.`;

    return _username;
});

const isDeleted = computed(() => props.message.deleted_at !== null);
const isReplyForMe = computed(() => store.getters.THIS_USER.id === props.message.from.model.id);

const categories = computed(() => {
    return props.message.tags.map(element => ucFirst(element.name)).join(', ');
});

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
});

const filesCountText = usePlural(
    toRef(() => props.message?.files?.length),
    '+ %d файл',
    '+ %d файла',
    '+ %d файлов'
);

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
