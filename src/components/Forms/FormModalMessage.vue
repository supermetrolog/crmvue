<template>
    <UiModal
        v-model:visible="isVisible"
        @close="close"
        custom-close
        class="modal-form-message"
        title="Редактирование сообщения"
        width="800"
    >
        <div class="messenger-chat-form">
            <Loader v-if="isLoading" />
            <AnimationTransition :speed="0.5">
                <MessengerChatFormAttachments
                    v-if="form.files.length"
                    @delete="deleteLocalFile"
                    :files="form.files"
                    class="new-attachments"
                />
            </AnimationTransition>
            <AnimationTransition :speed="0.5">
                <MessengerChatFormAttachments
                    v-if="form.currentFiles.length"
                    @delete="deleteFile"
                    :files="form.currentFiles"
                />
            </AnimationTransition>
            <div class="messenger-chat-form__settings">
                <MessengerChatFormRecipient
                    @change="currentContact = $event"
                    without-auto-toggle
                    :current="currentContact"
                    dropdown-class="messenger-chat-form-recipient-dropdown"
                />
                <MessengerChatFormCategories v-model="currentTag" />
            </div>
            <UiForm @submit.prevent class="messenger-chat-form__field" method="post">
                <UiButton @click="attachFile" class="messenger-chat-form__button" color="warning">
                    <i class="fa-solid fa-paperclip"></i>
                </UiButton>
                <UiTextarea
                    v-model.trim="form.message"
                    @keydown.enter.prevent="keyHandler"
                    placeholder="Напишите сообщение..."
                    class="messenger-chat-form__editor"
                    auto-height
                />
                <UiButton
                    @click="sendMessage"
                    class="messenger-chat-form__button"
                    :disabled="!canBeSend"
                    color="success"
                >
                    <i class="fa-solid fa-floppy-disk"></i>
                </UiButton>
                <UiButton @click="close" class="messenger-chat-form__button" color="danger">
                    <i class="fa-solid fa-xmark"></i>
                </UiButton>
            </UiForm>
        </div>
    </UiModal>
</template>
<script setup>
import MessengerChatFormCategories from '@/components/Messenger/Chat/Form/MessengerChatFormCategories.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatFormAttachments from '@/components/Messenger/Chat/Form/MessengerChatFormAttachments.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, inject, onUnmounted, ref, shallowRef } from 'vue';
import { useStore } from 'vuex';
import { MAX_FILES_COUNT } from '@/const/messenger.js';
import Loader from '@/components/common/Loader.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const $openAttachments = inject('$openAttachments');
const store = useStore();

const form = ref({});
const currentTag = ref(null);
const currentContact = ref(null);
const isVisible = shallowRef(false);
const isLoading = shallowRef(false);
const loadingFiles = ref([]);

const canBeSend = computed(() => {
    return (
        (form.value.message?.length > 0 ||
            form.value.currentFiles.length > 0 ||
            form.value.files.length > 0) &&
        form.value.files.length + form.value.currentFiles.length <= MAX_FILES_COUNT &&
        loadingFiles.value.length === 0 &&
        !isLoading.value
    );
});

const {
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('messageUpdater');

const propsToForm = () => {
    form.value = {
        id: props.value.id,
        message: props.value.message,
        currentFiles: cloneObject(props.value.files),
        files: []
    };

    currentTag.value = props.value.tags.length ? props.value.tags[0].id : null;
    currentContact.value = props.value.contacts.length
        ? cloneObject(props.value.contacts[0])
        : null;
};

const clearForm = () => {
    form.value = {};
    currentContact.value = null;
    currentTag.value = null;
};

onPopupShowed(() => {
    propsToForm();
    isVisible.value = true;
});

const formToPayload = () => {
    return {};
};

const submit = () => {
    _submit(formToPayload());
    isVisible.value = false;
};

const close = () => {
    isVisible.value = false;
    cancel();
    clearForm();
};

onUnmounted(() => {
    destroyPopup();
});

const deleteLocalFile = id => {
    form.value.files.splice(id, 1);
};

const deleteFile = id => {
    form.value.currentFiles.splice(id, 1);
};

const attachFile = async () => {
    const files = await $openAttachments();
    if (files?.fileList?.length) form.value.files.push(...files.fileList);
};

const sendMessage = async () => {
    const message = form.value.message.replace(/(\n)+$/g, '');

    if (!canBeSend.value) return;

    try {
        isLoading.value = true;

        const send = await store.dispatch('Messenger/updateMessage', {
            ...form.value,
            message,
            contact: currentContact.value,
            tag: currentTag.value
        });

        if (send) submit(send);
        else cancel();
    } finally {
        isLoading.value = false;
    }
};

const keyHandler = event => {
    if (event.shiftKey) form.value.message += '\n';
    else sendMessage();
};
</script>
