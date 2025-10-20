<template>
    <Modal
        @close="close"
        :show="isOpened"
        title="Загрузка файлов и изображений"
        class="modal-messenger-attachment"
        width="1200"
    >
        <div class="messenger-attachment">
            <UiForm>
                <FileInput v-model:native="form.files" label="Файлы или фотографии" />
            </UiForm>
            <div class="messenger-attachment__footer">
                <MessengerButton @click="submit" color="success">Сохранить</MessengerButton>
                <MessengerButton @click="close" color="danger">Отмена</MessengerButton>
            </div>
        </div>
    </Modal>
</template>
<script setup lang="ts">
import Modal from '@/components/common/Modal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { reactive, ref, shallowRef, watch } from 'vue';
import { usePasteFiles } from '@/composables/usePasteFiles';

defineEmits<{
    (e: 'close'): void;
}>();

const form = reactive({
    files: []
});

const isOpened = ref(false);

const currentPromise = shallowRef({
    resolve: (value: unknown) => {},
    reject: () => {}
});

function open() {
    form.files = [];

    const promise = new Promise((resolve, reject) => {
        currentPromise.value.resolve = resolve;
        currentPromise.value.reject = reject;
    });

    isOpened.value = true;

    return promise;
}

function close() {
    currentPromise.value.resolve(false);
    isOpened.value = false;
}

function submit() {
    currentPromise.value.resolve(form);
    isOpened.value = false;
}

defineExpose({ open, close });

const { startHandleEvent, stopHandleEvent } = usePasteFiles(document, () => form.files, {
    useEventListener: false
});

watch(isOpened, value => {
    if (value) {
        startHandleEvent();
    } else {
        stopHandleEvent();
    }
});
</script>
