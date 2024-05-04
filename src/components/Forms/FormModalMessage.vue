<template>
    <Modal
        v-if="opened"
        @close="close"
        class="modal-form-message"
        title="Редактирование сообщения"
        width="800"
    >
        <div class="messenger-chat-form">
            <AnimationTransition :speed="0.5">
                <MessengerChatFormAttachments
                    v-if="form.attachments?.length"
                    @delete="deleteFile"
                    :files="form.attachments"
                />
            </AnimationTransition>
            <div class="messenger-chat-form__settings">
                <MessengerChatFormRecipient
                    @change="setCurrentContact"
                    :without-auto-toggle="true"
                    :current="form.recipient"
                    dropdown-class="messenger-chat-form-recipient-dropdown"
                />
                <MessengerChatFormCategories
                    @change="form.category = $event"
                    :current="form.category"
                />
            </div>
            <Form @submit.prevent class="messenger-chat-form__field" method="post">
                <Button @click="attachFile" class="messenger-chat-form__button" warning icon>
                    <i class="fa-solid fa-paperclip"></i>
                </Button>
                <Textarea
                    v-model.trim="form.text"
                    @keydown.enter.prevent="keyHandler"
                    placeholder="Напишите сообщение..."
                    class="messenger-chat-form__editor"
                    auto-height
                />
                <Button
                    @click="sendMessage"
                    class="messenger-chat-form__button"
                    :disabled="!form.text?.length && !form.attachments?.length"
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
import { mapGetters } from 'vuex';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import Button from '@/components/common/Button.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import { cloneObject } from '@/utils/index.js';
import Form from '@/components/common/Forms/Form.vue';

export default {
    name: 'FormModalMessage',
    components: {
        MessengerChatFormRecipient,
        AnimationTransition,
        MessengerChatFormAttachments,
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
                text: null,
                category: null,
                attachments: [],
                recipient: null
            }
        };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    },
    watch: {
        opened(value) {
            if (value) {
                this.form = cloneObject(this.promiseProps);
            } else {
                this.form = {
                    id: null,
                    text: null,
                    category: null,
                    attachments: [],
                    recipient: null
                };
            }
        }
    },
    methods: {
        keyHandler(event) {
            if (event.shiftKey) this.form.text += '\n';
            else this.sendMessage();
        },
        async sendMessage() {
            this.form.text = this.form.text.replace(/(\n)+$/g, '');

            if (!this.form.text?.length && !this.form.attachments.length) return;

            const sended = await this.$store.dispatch('Messenger/updateMessage', this.form);

            if (sended) {
                this.form.attachments = [];
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
        },
        setCurrentContact(contact) {
            this.form.recipient = contact;
        }
    }
};
</script>
