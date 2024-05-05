<template>
    <div class="messenger-chat-form">
        <!--        <AnimationTransition :speed="0.5">-->
        <!--            <MessengerChatFormAttachments-->
        <!--                v-if="currentFiles.length"-->
        <!--                @delete="deleteFile"-->
        <!--                :files="currentFiles"-->
        <!--            />-->
        <!--        </AnimationTransition>-->
        <!--        <div class="messenger-chat-form__settings">-->
        <!--            <MessengerChatFormRecipient @change="setCurrentContact" :current="currentContact" />-->
        <!--            <MessengerChatFormCategories-->
        <!--                @change="changeCurrentCategory"-->
        <!--                :current="currentCategory"-->
        <!--            />-->
        <!--        </div>-->
        <Form @submit.prevent class="messenger-chat-form__field" method="post">
            <!--            <Button @click="attachFile" class="messenger-chat-form__button" warning icon>-->
            <!--                <i class="fa-solid fa-paperclip"></i>-->
            <!--            </Button>-->
            <Textarea
                v-model.trim="message"
                @keydown.enter.prevent="keyHandler"
                placeholder="Напишите сообщение..."
                class="messenger-chat-form__editor"
                auto-height
            />
            <Button
                @click="sendMessage"
                class="messenger-chat-form__button"
                :disabled="!message.length && !currentFiles.length"
                success
                icon
            >
                <i class="fa-solid fa-paper-plane"></i>
            </Button>
        </Form>
    </div>
</template>
<script>
import Form from '@/components/common/Forms/Form.vue';
import { mapGetters, mapState } from 'vuex';
import Button from '@/components/common/Button.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';

export default {
    name: 'MessengerChatForm',
    components: {
        Textarea,
        Button,
        Form
    },
    inject: ['$openAttachments'],
    data() {
        return {
            currentCategory: null,
            currentFiles: []
        };
    },
    computed: {
        message: {
            get() {
                return this.$store.state.Messenger.newMessage;
            },
            set(value) {
                this.$store.commit('Messenger/setNewMessage', value);
            }
        },
        ...mapState({ currentContact: state => state.Messenger.currentRecipient }),
        ...mapGetters(['THIS_USER'])
    },
    methods: {
        keyHandler(event) {
            if (event.shiftKey) this.message += '\n';
            else this.sendMessage();
        },
        setCurrentContact(contact) {
            this.$store.commit('Messenger/setCurrentRecipient', contact);
        },
        async sendMessage() {
            this.message = this.message.replace(/(\n)+$/g, '');

            if (!this.message.length && !this.currentFiles.length) return;

            this.message = this.message.replace(
                /(https?\S*)/g,
                '<a href="$1" target="_blank">$1</a>'
            );

            const sended = await this.$store.dispatch('Messenger/sendMessage', {
                tag_ids: this.currentCategory ? [this.currentCategory] : []
                // attachments: this.currentFiles
            });

            if (sended) {
                this.currentFiles = [];
            }
        },
        changeCurrentCategory(value) {
            this.currentCategory = value;
        },
        async attachFile() {
            const files = await this.$openAttachments();

            if (files?.length) {
                this.currentFiles.push(...files);
            }
        },
        deleteFile(id) {
            this.currentFiles.splice(id, 1);
        }
    }
};
</script>
