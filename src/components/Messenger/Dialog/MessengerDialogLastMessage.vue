<template>
    <div class="messenger-dialog__last-message">
        <Avatar
            class="messenger-dialog__last-message-user"
            :size="20"
            :src="lastMessage.from.model.userProfile.avatar"
            :label="lastMessage.from.model.userProfile.medium_name"
        />
        <span class="messenger-dialog__last-message-text" v-html="preparedMessage"></span>
        <span class="messenger-dialog__last-message-date">{{ createdAt }}</span>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { messengerTemplates } from '@/const/messenger.js';
import Avatar from '@/components/common/Avatar.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import dayjs from 'dayjs';

const props = defineProps({
    lastMessage: {
        type: Object,
        required: true
    }
});

const messageByTemplateMap = {
    [messengerTemplates.UNAVAILABLE_SURVEY]: 'Не удалось заполнить опросник..',
    [messengerTemplates.UNAVAILABLE_CONTACT]: 'Не удалось дозвониться до клиента..',
    [messengerTemplates.SURVEY]: 'Заполнил новый опрос с клиентом..'
};

const preparedMessage = computed(() => {
    if (props.lastMessage.template) {
        return messageByTemplateMap[props.lastMessage.template];
    }

    return props.lastMessage.message;
});

const createdAt = computed(() => {
    const dayjsDate = dayjsFromMoscow(props.lastMessage.created_at);

    if (dayjsDate.isToday()) return dayjsDate.format('HH:mm');
    if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
    if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    return dayjsDate.format('D.MM.YY, HH:mm');
});
</script>
