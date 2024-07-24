<template>
    <div class="messenger-chat-form">
        <AnimationTransition :speed="0.5">
            <MessengerChatFormAttachments
                v-if="currentFiles.fileList.length"
                @delete="deleteFile"
                :files="currentFiles.fileList"
            />
        </AnimationTransition>
        <div class="messenger-chat-form__settings">
            <MessengerChatFormRecipient
                @change="setCurrentContact"
                :current="currentContact"
                :without-auto-toggle="hasCachedMessage"
            />
            <MessengerChatFormCategories v-model="currentCategory" />
        </div>
        <Form @submit.prevent class="messenger-chat-form__field" method="post">
            <Button @click="attachFile" class="messenger-chat-form__button" warning icon>
                <i class="fa-solid fa-paperclip"></i>
            </Button>
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
                :disabled="!message.length && !currentFiles.fileList.length"
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
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'MessengerChatForm',
    components: {
        AnimationTransition,
        MessengerChatFormAttachments,
        MessengerChatFormCategories,
        MessengerChatFormRecipient,
        Textarea,
        Button,
        Form
    },
    inject: ['$openAttachments'],
    data() {
        return {
            currentFiles: {
                fileList: [],
                files: []
            }
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
        ...mapGetters({ THIS_USER: 'THIS_USER', hasCachedMessage: 'Messenger/hasCachedMessage' }),
        currentCategory: {
            get() {
                return this.$store.state.Messenger.currentCategory;
            },
            set(value) {
                this.$store.commit('Messenger/setCurrentCategory', value);
            }
        }
    },
    methods: {
        keyHandler(event) {
            if (event.shiftKey) this.message += '\n';
            else this.sendMessage();
        },
        setCurrentContact(contact) {
            this.$store.commit('Messenger/setCurrentRecipient', { contact });
        },
        async sendMessage() {
            this.message = this.message.replace(/(\n)+$/g, '');

            if (!this.message.length && !this.currentFiles.fileList.length) return;

            this.message = this.message.replace(
                /(https?\S*)/g,
                '<a href="$1" target="_blank">$1</a>'
            );

            const sended = await this.$store.dispatch('Messenger/sendMessage', {
                tag_ids: this.currentCategory ? [this.currentCategory] : [],
                files: this.currentFiles.fileList
            });

            if (sended) {
                this.currentFiles = {
                    files: [],
                    fileList: []
                };
            }
        },
        async attachFile() {
            const attachmentResponse = await this.$openAttachments();

            if (attachmentResponse?.fileList?.length) {
                this.currentFiles.files.push(...attachmentResponse.files);
                this.currentFiles.fileList.push(...attachmentResponse.fileList);
            }
        },
        deleteFile(id) {
            this.currentFiles.fileList.splice(id, 1);
            this.currentFiles.files.splice(id, 1);
        }
    },
    mounted() {
        if (this.hasCachedMessage) {
            this.$store.dispatch('Messenger/setCurrentMessageFromCache');
        }
    }
};
</script>
