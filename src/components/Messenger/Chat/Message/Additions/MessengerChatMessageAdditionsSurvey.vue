<template>
    <MessengerChatMessageAdditionsItem>
        <template #icon>
            <span
                v-tippy="'Заполненный опросник'"
                @click="showPreview"
                class="messenger-chat-message-addition__icon rounded-icon bg-primary"
            >
                <i class="fa-solid fa-phone"></i>
            </span>
        </template>
        <template #additionalIcons>
            <Avatar
                :label="`${addition.user.userProfile.medium_name} является автором`"
                :size="30"
                :src="addition.user.userProfile.avatar"
            />
        </template>
        <template #content>
            <span class="messenger-chat-message-addition__model">
                {{ modelType }}
            </span>
            <span>
                опросник #{{ addition.id }} с {{ addition.contact.full_name }} от
                {{ createdAt }}
            </span>
        </template>
    </MessengerChatMessageAdditionsItem>
</template>
<script setup>
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Avatar from '@/components/common/Avatar.vue';
import { toDateFormat } from '@/utils/formatter.js';
import { computed } from 'vue';
import { messenger } from '@/const/messenger.js';

const props = defineProps({
    addition: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    }
});

const { show: showSurvey } = useAsyncPopup('surveyPreview');

const createdAt = computed(() => toDateFormat(props.addition.created_at, 'D.MM.YY'));
const modelType = computed(() => {
    if (props.addition.chat_member.model_type === messenger.dialogTypes.COMPANY)
        return 'Клиентский';
    return 'Объектовый';
});

const showPreview = () => {
    showSurvey({ surveyId: props.addition.id });
};
</script>
