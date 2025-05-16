<template>
    <div class="messenger-dialog__last-message" :class="{ column }">
        <div class="messenger-dialog__last-message-header">
            <Avatar
                class="messenger-dialog__last-message-user"
                :size="20"
                :src="lastMessage.from.model.userProfile.avatar"
                :label="lastMessage.from.model.userProfile.medium_name"
            />
            <template v-if="column">
                <span>{{ lastMessage.from.model.userProfile.medium_name }}</span>
                <span class="messenger-dialog__last-message-date">
                    {{ createdAt }}
                </span>
                <slot name="after" />
            </template>
        </div>
        <span class="messenger-dialog__last-message-text" v-html="preparedMessage"></span>
        <span v-if="!column" class="messenger-dialog__last-message-date">{{ createdAt }}</span>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { messengerTemplates } from '@/const/messenger.js';
import Avatar from '@/components/common/Avatar.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import dayjs from 'dayjs';
import { plural } from '@/utils/plural.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    lastMessage: {
        type: Object,
        required: true
    },
    column: Boolean
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

    if (isNotNullish(props.lastMessage.message)) return props.lastMessage.message;

    return pluralFileLength.value;
});

const createdAt = computed(() => {
    const dayjsDate = dayjsFromMoscow(props.lastMessage.created_at);

    if (dayjsDate.isToday()) return dayjsDate.format('HH:mm');
    if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
    if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    return dayjsDate.format('D.MM.YY, HH:mm');
});

const pluralFileLength = computed(() => {
    return plural(props.lastMessage.files?.length ?? 0, '%d файл', '%d файла', '%d файлов');
});
</script>
