<template>
    <div class="messenger-dialog__last-message" :class="{ column }">
        <div class="messenger-dialog__last-message-header">
            <slot name="before" />
            <Avatar
                v-if="!hideAvatar"
                class="messenger-dialog__last-message-user"
                :size="20"
                :src="lastMessage.from.model.userProfile.avatar"
                :label="onlyAvatar ? undefined : lastMessage.from.model.userProfile.medium_name"
            />
            <template v-if="column">
                <span v-if="!hideAvatar">{{ lastMessage.from.model.userProfile.medium_name }}</span>
                <span class="messenger-dialog__last-message-date">
                    <Tippy :content="createdAtFull">
                        {{ createdAt }}
                    </Tippy>
                </span>
                <span
                    v-if="lastMessage.created_at !== lastMessage.updated_at"
                    class="messenger-dialog__last-message-date"
                >
                    (ред.
                    <Tippy :content="updatedAtLabel"> {{ updatedAt }} </Tippy>)
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
import Avatar from '@/components/common/Avatar.vue';
import { dayjsFromServer } from '@/utils/formatters/date.ts';
import dayjs from 'dayjs';
import { plural } from '@/utils/plural.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { Tippy } from 'vue-tippy';

const props = defineProps({
    lastMessage: {
        type: Object,
        required: true
    },
    column: Boolean,
    hideAvatar: Boolean,
    onlyAvatar: Boolean
});

const preparedMessage = computed(() => {
    if (isNotNullish(props.lastMessage.message)) return props.lastMessage.message;

    return pluralFileLength.value;
});

const createdAt = computed(() => {
    const dayjsDate = dayjsFromServer(props.lastMessage.created_at);

    if (dayjsDate.isToday()) return dayjsDate.format('HH:mm');
    if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
    if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    return dayjsDate.format('D.MM.YY, HH:mm');
});

const createdAtFull = computed(() => {
    return dayjsFromServer(props.lastMessage.created_at).format('D MMMM YYYY, HH:mm');
});

const updatedAt = computed(() => {
    const dayjsDate = dayjsFromServer(props.lastMessage.updated_at);

    if (dayjsDate.isToday()) return dayjsDate.format('HH:mm');
    if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
    if (dayjsDate.isSame(dayjs(), 'year')) return dayjsDate.format('D.MM, HH:mm');
    return dayjsDate.format('D.MM.YY, HH:mm');
});

const updatedAtLabel = computed(() => {
    return `Изменено ${dayjsFromServer(props.lastMessage.updated_at).format('D MMMM YYYY, HH:mm')}`;
});

const pluralFileLength = computed(() => {
    return plural(props.lastMessage.files?.length ?? 0, '%d файл', '%d файла', '%d файлов');
});
</script>
