<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        class="modal-form-message"
        title="Новое сообщение"
        width="800"
    >
        <Spinner v-if="isSearching" label="Поиск чата.." />
        <div v-else-if="currentDialogId" class="messenger-chat-form">
            <FileInput ref="fileInputElement" v-model:native="form.files" hidden custom />
            <Loader v-if="isLoading" />
            <AnimationTransition :speed="0.5">
                <MessengerChatFormAttachments
                    v-if="form.files.length"
                    @delete="deleteFile"
                    :files="form.files"
                    class="new-attachments"
                />
            </AnimationTransition>
            <div class="messenger-chat-form__settings">
                <MessengerChatFormCategories v-model="form.tag" />
            </div>
            <UiForm @submit.prevent class="messenger-chat-form__field" method="post">
                <UiButton
                    @click.prevent="openFileDialog"
                    class="messenger-chat-form__button"
                    color="warning"
                    tooltip="Добавить файл"
                >
                    <i class="fa-solid fa-paperclip"></i>
                </UiButton>
                <VueEditor
                    ref="textareaEl"
                    v-model="form.message"
                    @paste.prevent
                    :toolbar="false"
                    placeholder="Напишите сообщение..."
                    class="messenger-chat-form__editor"
                    :min-height="50"
                    :max-height="140"
                />
                <UiButton
                    @click.prevent="sendMessage"
                    class="messenger-chat-form__button"
                    :disabled="!canBeSend || isSearching"
                    color="success"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                </UiButton>
            </UiForm>
        </div>
        <EmptyData v-else no-rounded class="text-center">
            <p>Не удалось найти чат..</p>
            <p>Новые объекты/компании появляются в чате в течение 15 минут после внесения!</p>
        </EmptyData>
    </UiModal>
</template>
<script setup>
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import { computed, onBeforeMount, reactive, ref, useTemplateRef } from 'vue';
import { MAX_FILES_COUNT } from '@/const/messenger.js';
import Loader from '@/components/common/Loader.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { usePasteFiles } from '@/composables/usePasteFiles.js';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import api from '@/api/api.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';

const emit = defineEmits(['close', 'created']);
const props = defineProps({
    modelId: Number,
    modelType: String
});

const form = reactive({
    files: [],
    tag: null,
    message: null
});

const isLoading = ref(false);

const canBeSend = computed(() => {
    return (
        (form.message?.length > 0 || form.files.length > 0) &&
        form.files.length <= MAX_FILES_COUNT &&
        !isLoading.value
    );
});

async function sendMessage() {
    if (!canBeSend.value) return;

    try {
        isLoading.value = true;

        const chatMemberMessage = await api.messenger.sendMessage(currentDialogId.value, {
            message: form.message.length ? form.message : null,
            contact_ids: [],
            tag_ids: form.tag ? [form.tag] : [],
            files: form.files
        });

        emit('created', chatMemberMessage);
    } finally {
        isLoading.value = false;
    }
}

// chat member search

const currentDialogId = ref(null);
const isSearching = ref(false);

async function searchChatMember() {
    isSearching.value = true;

    try {
        const dialog = await api.messenger.getDialogByQuery({
            model_id: props.modelId,
            model_type: props.modelType
        });

        if (isNotNullish(dialog)) {
            currentDialogId.value = dialog.id;
        }
    } finally {
        isSearching.value = false;
    }
}

onBeforeMount(searchChatMember);

// files

const fileInputElement = useTemplateRef('fileInputElement');

function openFileDialog() {
    fileInputElement.value.open();
}

function deleteFile(fileIndex) {
    form.files.splice(fileIndex, 1);
}

const textareaEl = useTemplateRef('textareaEl');

usePasteFiles(textareaEl, form.files);

// TODO: Возможно внедрить выбор контакта. Но опять же, его нужно будет грузить в зависимости есть ли вообще компания
</script>
