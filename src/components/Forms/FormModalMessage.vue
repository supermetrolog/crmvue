<template>
    <Modal
        v-if="opened"
        @close="close"
        class="modal-form-message"
        title="Редактирование сообщения"
        width="800"
    >
        <div class="messenger-chat-form">
            <!--            <AnimationTransition :speed="0.5">-->
            <!--                <MessengerChatFormAttachments-->
            <!--                    v-if="form.attachments?.length"-->
            <!--                    @delete="deleteFile"-->
            <!--                    :files="form.attachments"-->
            <!--                />-->
            <!--            </AnimationTransition>-->
            <div class="messenger-chat-form__settings">
                <MessengerChatFormRecipient
                    @change="currentContact = $event"
                    without-auto-toggle
                    :current="currentContact"
                    dropdown-class="messenger-chat-form-recipient-dropdown"
                />
                <MessengerChatFormCategories @change="currentTag = $event" :current="currentTag" />
            </div>
            <Form @submit.prevent class="messenger-chat-form__field" method="post">
                <!--                <Button @click="attachFile" class="messenger-chat-form__button" warning icon>-->
                <!--                    <i class="fa-solid fa-paperclip"></i>-->
                <!--                </Button>-->
                <Textarea
                    v-model.trim="form.message"
                    @keydown.enter.prevent="keyHandler"
                    placeholder="Напишите сообщение..."
                    class="messenger-chat-form__editor"
                    auto-height
                />
                <Button
                    @click="sendMessage"
                    class="messenger-chat-form__button"
                    :disabled="!form.message?.length"
                    success
                    icon
                >
                    <i class="fa-solid fa-floppy-disk"></i>
                </Button>
                <Button @click="close" class="messenger-chat-form__button" danger icon>
                    <i class="fa-solid fa-xmark"></i>
                </Button>
            </Form>
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import Button from '@/components/common/Button.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import Form from '@/components/common/Forms/Form.vue';
import { cloneObject } from '@/utils/index.js';

export default {
    name: 'FormModalMessage',
    components: {
        MessengerChatFormRecipient,
        MessengerChatFormCategories,
        Modal,
        Button,
        Textarea,
        Form
    },
    mixins: [AsyncModalMixin],
    inject: ['$openAttachments'],
    data() {
        return {
            form: {
                id: null,
                message: null
            },
            currentTag: null,
            currentContact: null
        };
    },
    watch: {
        opened(value) {
            if (value) {
                this.form = {
                    id: this.promiseProps.id,
                    message: this.promiseProps.message
                };

                this.currentTag = this.promiseProps.tags.length
                    ? this.promiseProps.tags[0].id
                    : null;
                this.currentContact = this.promiseProps.contacts.length
                    ? cloneObject(this.promiseProps.contacts[0])
                    : null;
            } else {
                this.form = {
                    id: null,
                    message: null
                };

                this.currentContact = null;
                this.currentTag = null;
            }
        }
    },
    methods: {
        keyHandler(event) {
            if (event.shiftKey) this.form.message += '\n';
            else this.sendMessage();
        },
        async sendMessage() {
            this.form.message = this.form.message.replace(/(\n)+$/g, '');

            if (!this.form.message?.length && !this.form.message.length) return;

            const sended = await this.$store.dispatch('Messenger/updateMessage', {
                ...this.form,
                contact: this.currentContact,
                tag: this.currentTag
            });

            if (sended) {
                this.resolve();
            } else {
                this.close();
            }
        },
        async attachFile() {
            const files = await this.$openAttachments();

            if (files) {
                if (this.form.attachments?.length) {
                    this.form.attachments.push(...files);
                } else this.form.attachments = [...files];
            }
        },
        deleteFile(id) {
            this.form.attachments.splice(id, 1);
        }
    }
};
</script>
