<template>
    <div class="messenger" :class="{ active: isOpen }">
        <MessengerButton @click="isOpen = !isOpen" />
        <div v-if="isActive" ref="body" class="messenger__content">
            <MessengerAside class="messenger__aside" />
            <MessengerPanel class="messenger__panel" />
            <MessengerChat v-if="currentDialog" class="messenger__chat" />
            <MessengerChatEmpty v-else />
        </div>
    </div>
</template>
<script>
import MessengerAside from '@/components/Messenger/Aside/MessengerAside.vue';
import MessengerChat from '@/components/Messenger/Chat/MessengerChat.vue';
import MessengerPanel from '@/components/Messenger/Panel/MessengerPanel.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import { mapState } from 'vuex';

export default {
    name: 'Messenger',
    components: {
        MessengerChatEmpty,
        MessengerButton,
        MessengerPanel,
        MessengerChat,
        MessengerAside
    },
    data() {
        return {
            isOpen: false,
            isActive: false,
            timeout: null
        };
    },
    computed: {
        ...mapState({ currentDialog: state => state.Messenger.currentDialog })
    },
    watch: {
        isOpen(value) {
            if (value) {
                document.body.classList.add('is-modal');

                this.isActive = true;

                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = null;
            } else {
                document.body.classList.remove('is-modal');

                this.timeout = setTimeout(() => {
                    this.isActive = false;
                }, 700);
            }
        }
    },
    methods: {
        escapeHandler(event) {
            if (this.isActive && event.code === 'Escape') this.isOpen = false;
        }
    },
    mounted() {
        document.addEventListener('keydown', this.escapeHandler);
    },
    unmounted() {
        document.removeEventListener('keydown', this.escapeHandler);
    }
};
</script>
