<template>
    <div @click="toPinned" class="messenger-chat-pinned">
        <i class="fa-solid fa-lock"></i>
        <div
            class="messenger-chat-pinned__text"
            v-html="message.message?.length ? message.message : fileNames"
        ></div>
    </div>
</template>
<script>
import plural from 'plural-ru';

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
        }
    },
    methods: {
        toPinned() {
            return;
        }
    }
};
</script>
