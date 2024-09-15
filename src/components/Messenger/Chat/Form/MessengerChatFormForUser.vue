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
import { computed, inject, onMounted, ref } from 'vue';

const store = useStore();

const $openAttachments = inject('$openAttachments');

const currentFiles = ref({
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

    if (!message.value.length && !currentFiles.value.fileList.length) return;

    message.value = message.value.replace(/(https?\S*)/g, '<a href="$1" target="_blank">$1</a>');

    const sends = await store.dispatch('Messenger/sendMessage', {
        tag_ids: currentCategory.value ? [currentCategory.value] : [],
        files: currentFiles.value.fileList
    });

    if (sends) {
        currentFiles.value = {
            files: [],
            fileList: []
        };
    }
};

const attachFile = async () => {
    const attachmentResponse = await $openAttachments();

    if (attachmentResponse?.fileList?.length) {
        currentFiles.value.files.push(...attachmentResponse.files);
        currentFiles.value.fileList.push(...attachmentResponse.fileList);
    }
};

const keyHandler = event => {
    if (event.shiftKey) message.value += '\n';
    else sendMessage();
};

const deleteFile = id => {
    currentFiles.value.fileList.splice(id, 1);
    currentFiles.value.files.splice(id, 1);
};

onMounted(() => {
    if (hasCachedMessage.value) store.dispatch('Messenger/setCurrentMessageFromCache');
});
</script>
