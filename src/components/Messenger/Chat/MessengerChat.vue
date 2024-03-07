<template>
    <div class="messenger-chat">
        <div class="messenger-chat__content">
            <MessengerChatHeader />
            <div class="messenger-chat__body"></div>
            <MessengerChatForm />
        </div>
    </div>
</template>
<script>
import MessengerChatHeader from '@/components/Messenger/Chat/MessengerChatHeader.vue';
import MessengerChatForm from '@/components/Messenger/Chat/MessengerChatForm.vue';

export default {
    name: 'MessengerChat',
    components: {
        MessengerChatForm,
        MessengerChatHeader
    },
    methods: {
        scrollToEnd() {
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
        }
    },
    mounted() {
        this.scrollToEnd();
    }
};
</script>
