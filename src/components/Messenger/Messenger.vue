<template>
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
            <FormModalChatMemberLastCall />
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
import api from '@/api/api.js';
import FormModalChatMemberLastCall from '@/components/Forms/FormModalChatMemberLastCall.vue';

export default {
    name: 'Messenger',
    components: {
        FormModalChatMemberLastCall,
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
        },
        async openChat(companyID, objectID) {
            const dialog = await api.messenger.getDialogByQuery({
                model_type: 'object',
                object_id: objectID
            });

            if (!dialog) {
                this.$toast('Данные по объекту не были найдены в чате');
                return;
            }

            this.isOpen = true;

            this.$store.dispatch('Messenger/selectPanel', {
                companyID: companyID,
                dialogID: dialog.id,
                dialogType: 'object',
                anywayOpen: true
            });

            this.$store.dispatch('Messenger/selectChat', {
                dialogID: dialog.id,
                companyID: companyID,
                dialogType: 'object',
                anywayOpen: true
            });
        },
        async openChatByID(chatMemberID) {
            const dialog = await api.messenger.getDialogByQuery({ id: chatMemberID });

            if (!dialog) {
                this.$toast('Данные о чате не были найдены в системе.');
                return;
            }

            let companyID = null;

            switch (dialog.model_type) {
                case 'object': {
                    companyID = dialog.model.object.company?.id;
                    break;
                }
                case 'request': {
                    companyID = dialog.model.company_id;
                    break;
                }
                case 'user': {
                    return;
                }
            }

            this.isOpen = true;

            this.$store.dispatch('Messenger/selectPanel', {
                companyID: companyID,
                dialogID: dialog.id,
                dialogType: dialog.model_type,
                anywayOpen: true
            });

            this.$store.dispatch('Messenger/selectChat', {
                dialogID: dialog.id,
                companyID: companyID,
                dialogType: dialog.model_type,
                anywayOpen: true
            });
        }
    },
    mounted() {
        document.addEventListener('keydown', this.escapeHandler);
    },
    unmounted() {
        this.$store.commit('Messenger/clearState');
        document.removeEventListener('keydown', this.escapeHandler);
    }
};
</script>
