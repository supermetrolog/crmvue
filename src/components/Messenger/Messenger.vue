<template>
    и
    <div class="messenger" :class="classList">
        <teleport to="body">
            <AnimationTransition :speed="0.7">
                <div v-if="isOpen && hasPanel" class="messenger-backdrop"></div>
            </AnimationTransition>
        </teleport>
        <MessengerBar @click="isOpen = !isOpen" />
        <div v-if="isActive" ref="body" class="messenger__content">
            <MessengerAside class="messenger__aside" />
            <MessengerPanel class="messenger__panel" />
            <MessengerChat class="messenger__chat" />
        </div>
        <teleport to="body">
            <MessengerAttachment ref="attachments" />
        </teleport>
    </div>
</template>
<script>
import MessengerAside from '@/components/Messenger/Aside/MessengerAside.vue';
import MessengerChat from '@/components/Messenger/Chat/MessengerChat.vue';
import MessengerPanel from '@/components/Messenger/Panel/MessengerPanel.vue';
import MessengerBar from '@/components/Messenger/MessengerBar.vue';
import { mapState } from 'vuex';
import MessengerAttachment from '@/components/Messenger/MessengerAttachment.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'Messenger',
    components: {
        AnimationTransition,
        MessengerAttachment,
        MessengerBar,
        MessengerPanel,
        MessengerChat,
        MessengerAside
    },
    provide() {
        return {
            $openAttachments: () => this.$refs.attachments?.open()
        };
    },
    data() {
        return {
            isOpen: false,
            hasPanel: false,
            isActive: false,
            timeout: null
        };
    },
    computed: {
        ...mapState({
            currentAsideDialogID: state => state.Messenger.currentAsideDialogID
        }),
        classList() {
            return { active: this.isOpen, 'has-panel': this.hasPanel };
        }
    },
    watch: {
        isOpen(value) {
            if (value) {
                this.isActive = true;

                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = null;
            } else {
                if (!this.currentAsideDialogID) this.hasPanel = false;
            }
        },
        currentAsideDialogID(value) {
            this.hasPanel = this.hasPanel || value;
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
