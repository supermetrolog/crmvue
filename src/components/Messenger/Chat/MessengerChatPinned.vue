<template>
    <div @click="toPinned" class="messenger-chat-pinned">
        <i class="fa-solid fa-lock"></i>
        <div
            class="messenger-chat-pinned__text"
            v-html="message.message?.length ? message.message : fileNames"
        ></div>
        <span class="messenger-chat-pinned__date">{{ date }}</span>
    </div>
</template>
<script>
import plural from 'plural-ru';
import dayjs from 'dayjs';

export default {
    name: 'MessengerChatPinned',
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        fileNames() {
            return `${plural(
                this.message.attachments.length,
                '%d файл',
                '%d файла',
                '%d файлов'
            )}: ${this.message.attachments.map(attachment => attachment.name).join(', ')}`;
        },
        date() {
            return dayjs(this.message.created_at).format('D.MM.YYYY, HH:mm');
        }
    },
    methods: {
        toPinned() {
            return;
        }
    }
};
</script>
