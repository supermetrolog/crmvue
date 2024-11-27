<template>
    <div class="messenger-chat-form">
        <Loader v-if="isLoading" />
        <AnimationTransition :speed="0.5">
            <MessengerChatFormReply
                v-if="replyTo"
                @cancel="$emit('cancel-reply')"
                class="mb-1"
                :message="replyTo"
            />
        </AnimationTransition>
        <AnimationTransition :speed="0.5">
            <MessengerChatFormAttachments
                v-if="currentFiles.length || loadingFiles.length"
                @delete="deleteFile"
                :files="currentFiles"
                :loadings="loadingFiles"
            />
        </AnimationTransition>
        <div class="messenger-chat-form__settings">
            <MessengerChatFormRecipient
                @change="setCurrentContact"
                :current="currentContact"
                :without-auto-toggle="hasCachedMessage"
            />
            <MessengerChatFormCategories v-model="currentCategory" :v="v$.currentCategory" />
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
                :disabled="!canBeSend"
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
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, inject, onBeforeMount, ref, shallowRef } from 'vue';
import imageCompression from 'browser-image-compression';
import { useNotify } from '@/utils/useNotify.js';
import { MAX_FILES_COUNT, SIZE_TO_COMPRESSION } from '@/const/messenger.js';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import Loader from '@/components/common/Loader.vue';
import MessengerChatFormReply from '@/components/Messenger/Chat/Form/MessengerChatFormReply.vue';

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

const props = defineProps({
    replyTo: {
        type: Object,
        default: null
    }
});
const emit = defineEmits(['cancel-reply']);

const $openAttachments = inject('$openAttachments');
const store = useStore();
const notify = useNotify();

const isLoading = shallowRef(false);
const currentFiles = ref([]);
const loadingFiles = ref([]);

const canBeSend = computed(() => {
    return (
        (message.value.length > 0 || currentFiles.value.length > 0) &&
        currentFiles.value.length <= MAX_FILES_COUNT &&
        loadingFiles.value.length === 0 &&
        !isLoading.value
    );
});

const currentContact = computed(() => store.state.Messenger.currentRecipient);
const hasCachedMessage = computed(() => store.getters['Messenger/hasCachedMessage']);

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

const v$ = useVuelidate(
    {
        currentCategory: {
            required: helpers.withMessage('Выберите категорию!', required)
        }
    },
    {
        currentCategory
    }
);

const sendMessage = async () => {
    v$.value.$validate();
    if (v$.value.$error) return;

    message.value = message.value.replace(/(\n)+$/g, '');

    if (!canBeSend.value) return;

    isLoading.value = true;
    message.value = message.value.replace(/(https?\S*)/g, '<a href="$1" target="_blank">$1</a>');

    const send = await store.dispatch('Messenger/sendMessage', {
        tag_ids: currentCategory.value ? [currentCategory.value] : [],
        files: currentFiles.value,
        reply_to_id: props.replyTo?.id
    });

    if (send) {
        currentFiles.value = [];
        emit('cancel-reply');
    }

    isLoading.value = false;
};

const keyHandler = event => {
    if (event.shiftKey) message.value = message.value + '\n';
    else sendMessage();
};

let pastedUniqueIndex = 1;

const pasteHandler = async event => {
    if (event.clipboardData.files.length) {
        const files = Array.from(event.clipboardData.files);

        files.forEach(element => {
            const file = new File([element], pastedUniqueIndex + '-' + element.name, {
                type: element.type
            });
            file.created_at = 'Только что';

            pastedUniqueIndex++;

            if (file.type.match('image')) {
                if (file.size >= SIZE_TO_COMPRESSION) {
                    const uid = `${file.name}-${file.lastModified}`;
                    loadingFiles.value.push({ id: uid, progress: 0 });

                    try {
                        imageCompression(file, {
                            ...compressionOptions,
                            onProgress: value => {
                                const index = loadingFiles.value.findIndex(
                                    element => element.id === uid
                                );
                                if (index !== -1) loadingFiles.value[index].progress = value;
                            }
                        }).then(async compressed => {
                            const _file = blobToFile(compressed, file);
                            _file.src = await imageCompression.getDataUrlFromFile(compressed);

                            currentFiles.value.push(_file);

                            const index = loadingFiles.value.findIndex(
                                element => element.id === uid
                            );
                            if (index !== -1) loadingFiles.value.splice(index, 1);
                        });
                    } catch (e) {
                        notify.error(
                            'Произошла ошибка при оптимизации изображения. Попробуйте еще раз или используйте другое изображение',
                            'Загрузка изображения'
                        );

                        const index = loadingFiles.value.findIndex(element => element.id === uid);
                        if (index !== -1) loadingFiles.value.splice(index, 1);
                    }
                } else {
                    imageCompression.getDataUrlFromFile(file).then(src => {
                        file.src = src;
                        currentFiles.value.push(file);
                    });
                }
            } else {
                currentFiles.value.push(file);
            }
        });
    }
};

const setCurrentContact = contact => {
    store.commit('Messenger/setCurrentRecipient', { contact });
};

const attachFile = async () => {
    const attachmentResponse = await $openAttachments();

    if (attachmentResponse?.fileList?.length) {
        currentFiles.value.push(...attachmentResponse.fileList);
    }
};

const deleteFile = id => {
    currentFiles.value.splice(id, 1);
};

onBeforeMount(() => {
    if (hasCachedMessage.value) store.dispatch('Messenger/setCurrentMessageFromCache');
});
</script>
