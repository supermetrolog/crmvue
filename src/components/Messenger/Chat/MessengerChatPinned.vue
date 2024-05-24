<template>
    <div class="messenger-chat-pinned">
        <i class="fa-solid fa-lock"></i>
        <i
            v-tippy="'Перейти к сообщению'"
            @click="viewIsOpened = true"
            class="fa-solid fa-up-right-from-square c-pointer"
        ></i>
        <div
            class="messenger-chat-pinned__text"
            v-html="message.message?.length ? message.message : fileNames"
        ></div>
        <span class="messenger-chat-pinned__date">{{ date }}</span>
        <i v-tippy="'Открепить сообщение'" @click="unpin" class="fa-solid fa-xmark c-pointer"></i>
    </div>
    <teleport to="body">
        <MessengerChatPinnedView v-if="viewIsOpened" @close="viewIsOpened = false" />
    </teleport>
</template>
<script>
import plural from 'plural-ru';
import dayjs from 'dayjs';
import MessengerChatPinnedView from '@/components/Messenger/Chat/MessengerChatPinnedView.vue';

export default {
    name: 'MessengerChatPinned',
    components: { MessengerChatPinnedView },
    inject: ['$confirmPopup'],
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            viewIsOpened: false
        };
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
            return dayjs(this.message.created_at).format('D.MM.YY, HH:mm');
        }
    },
    methods: {
        async unpin() {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите открепить сообщение?'
            );
            if (!confirmed) return;

            const unpinned = await this.$store.dispatch('Messenger/unpinMessage');
            if (unpinned) this.$toast('Сообщение успешно откреплено');
        }
    }
};
</script>
