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
            <MessengerChatFormCategories v-model="currentCategory" />
        </div>
        <UiForm @submit.prevent class="messenger-chat-form__field" method="post">
            <Button @click="attachFile" class="messenger-chat-form__button" warning icon>
                <i class="fa-solid fa-paperclip"></i>
            </Button>
            <VueEditor
                v-model="message"
                @paste="pasteHandler"
                :toolbar="false"
                placeholder="Напишите сообщение..."
                class="messenger-chat-form__editor"
                :min-height="50"
                :max-height="140"
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
        </UiForm>
    </div>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import { useStore } from 'vuex';
import Button from '@/components/common/Button.vue';
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, inject, onMounted, ref, shallowRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import imageCompression from 'browser-image-compression';
import { MAX_FILES_COUNT, SIZE_TO_COMPRESSION } from '@/const/messenger.js';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import Loader from '@/components/common/Loader.vue';
import MessengerChatFormReply from '@/components/Messenger/Chat/Form/MessengerChatFormReply.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

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

const store = useStore();
const notify = useNotify();
const $openAttachments = inject('$openAttachments');

const isLoading = shallowRef(false);
const currentFiles = ref([]);
const loadingFiles = ref([]);

const canBeSend = computed(() => {
    return (
        message.value.length &&
        currentFiles.value.length <= MAX_FILES_COUNT &&
        loadingFiles.value.length === 0 &&
        !isLoading.value
    );
});

const message = computed({
    get() {
        return store.state.Messenger.newMessage;
    },
    set(value) {
        store.state.Messenger.newMessage = value;
    }
});

const currentCategory = computed({
    get() {
        return store.state.Messenger.currentCategory;
    },
    set(value) {
        store.state.Messenger.currentCategory = value;
    }
});

const hasCachedMessage = computed(() => store.getters['Messenger/hasCachedMessage']);

const sendMessage = async () => {
    message.value = message.value.replace(/(\n)+$/g, '');

    if (!message.value.length) return;

    isLoading.value = true;

    const sends = await store.dispatch('Messenger/sendMessage', {
        tag_ids: currentCategory.value ? [currentCategory.value] : [],
        files: currentFiles.value,
        reply_to_id: props.replyTo?.id
    });

    if (sends) {
        currentFiles.value = [];
        emit('cancel-reply');
    }

    isLoading.value = false;
};

let pastedUniqueIndex = 1;

const pasteHandler = async event => {
    if (event.clipboardData.files.length) {
        const files = Array.from(event.clipboardData.files);

        files.forEach(element => {
            const file = new File([element], pastedUniqueIndex + '-' + element.name, {
                type: element.type
            });

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

const attachFile = async () => {
    const attachmentResponse = await $openAttachments();

    if (attachmentResponse?.files?.length) {
        currentFiles.value.push(...attachmentResponse.files);
    }
};

const deleteFile = id => {
    currentFiles.value.splice(id, 1);
};

onMounted(() => {
    if (hasCachedMessage.value) store.dispatch('Messenger/setCurrentMessageFromCache');
});
</script>
