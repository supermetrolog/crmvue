<template>
    <MessengerChatMessageAdditionsItem>
        <template #icon>
            <span
                v-tippy="'Заполненный опрос'"
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
            {{ surveyTitle }}
        </template>
    </MessengerChatMessageAdditionsItem>
</template>
<script setup>
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Avatar from '@/components/common/Avatar.vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

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

const createdAt = computed(() =>
    toDateFormat(props.addition.completed_at ?? props.addition.created_at, 'D.MM.YY')
);

const surveyTitle = computed(() => {
    const parts = [`Опрос #${props.addition.id}`];

    if (isNotNullish(props.addition.contact)) {
        parts.push(`с ${props.addition.contact.full_name}`);
    }

    parts.push(`от ${createdAt.value}`);

    return parts.join(' ');
});

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function showPreview() {
    showSurvey({ surveyId: props.addition.id });
}
</script>
