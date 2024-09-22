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
            <MessengerChatFormCategories v-model="currentCategory" />
        </div>
        <Form @submit.prevent class="messenger-chat-form__field" method="post">
            <Button @click="attachFile" class="messenger-chat-form__button" warning icon>
                <i class="fa-solid fa-paperclip"></i>
            </Button>
            <Textarea
                v-model.trim="message"
                @keydown.enter.prevent="keyHandler"
                @paste="pasteHandler"
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
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import { useStore } from 'vuex';
import Button from '@/components/common/Button.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, inject, onMounted, reactive } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import imageCompression from 'browser-image-compression';

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

const store = useStore();
const notify = useNotify();
const $openAttachments = inject('$openAttachments');

const currentFiles = reactive({
    fileList: [],
    files: []
});

const message = computed({
    get() {
        return store.state.Messenger.newMessage;
    },
    set(value) {
        store.commit('Messenger/setNewMessage', value);
    }
});

const currentCategory = computed({
    get() {
        return store.state.Messenger.currentCategory;
    },
    set(value) {
        store.commit('Messenger/setCurrentCategory', value);
    }
});

const hasCachedMessage = computed(() => store.getters['Messenger/hasCachedMessage']);

const sendMessage = async () => {
    message.value = message.value.replace(/(\n)+$/g, '');

    if (!message.value.length && !currentFiles.fileList.length) return;

    message.value = message.value.replace(/(https?\S*)/g, '<a href="$1" target="_blank">$1</a>');

    const sends = await store.dispatch('Messenger/sendMessage', {
        tag_ids: currentCategory.value ? [currentCategory.value] : [],
        files: currentFiles.fileList
    });

    if (sends) {
        currentFiles.files = [];
        currentFiles.fileList = [];
    }
};

const pasteHandler = async event => {
    if (event.clipboardData.files.length) {
        const files = Array.from(event.clipboardData.files);

        try {
            const compressionFiles = await Promise.allSettled(
                files.map(element => imageCompression(element, compressionOptions))
            );

            compressionFiles.forEach(fileObject => {
                const file = fileObject.value;
                const reader = new FileReader();

                reader.onload = event => {
                    file.src = event.target.result;
                    currentFiles.files.push(file);
                    currentFiles.fileList.push(file);
                };

                reader.readAsDataURL(file);
            });
        } catch (e) {
            notify.error(
                'Произошла ошибка при оптимизации файла. Попробуйте еще раз или используйте другой файл',
                'Загрузка файла'
            );
        }
    }
};

const attachFile = async () => {
    const attachmentResponse = await $openAttachments();

    if (attachmentResponse?.fileList?.length) {
        currentFiles.files.push(...attachmentResponse.files);
        currentFiles.fileList.push(...attachmentResponse.fileList);
    }
};

const keyHandler = event => {
    if (event.shiftKey) message.value += '\n';
    else sendMessage();
};

const deleteFile = id => {
    currentFiles.fileList.splice(id, 1);
    currentFiles.files.splice(id, 1);
};

onMounted(() => {
    if (hasCachedMessage.value) store.dispatch('Messenger/setCurrentMessageFromCache');
});
</script>
