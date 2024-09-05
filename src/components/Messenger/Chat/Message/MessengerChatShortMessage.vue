<template>
    <div class="messenger-chat-message">
        <div class="messenger-chat-message__wrapper">
            <Avatar :src="message.from.model.userProfile.avatar" size="55" />
            <div class="messenger-chat-message__content">
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
import { entityOptions } from '@/const/options/options';
import Avatar from '@/components/common/Avatar.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';
import { computed } from 'vue';
import { ucFirst } from '@/utils/formatter.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const originalDate = computed(() => {
    return props.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
});
const formattedDate = computed(() => {
    return props.message.dayjs_date.format('H:mm');
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
</script>
