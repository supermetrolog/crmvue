<template>
    <Modal
        @close="close"
        :show="isOpened"
        title="Загрузка файлов и изображений"
        class="modal-messenger-attachment"
        width="1200"
    >
        <div ref="attachmentRef" class="messenger-attachment">
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
import { reactive, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { usePasteFiles } from '@/composables/usePasteFiles';
import { useTour } from '@/composables/useTour/useTour';
import { useTimeoutFn } from '@vueuse/core';

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

        if (!tourAlreadyRun.value) {
            useTimeoutFn(softRun, 1000);
            tourAlreadyRun.value = true;
        }
    } else {
        stopHandleEvent();
    }
});

const tourAlreadyRun = ref(false);

const attachmentRef = useTemplateRef('attachmentRef');

const { softRun } = useTour('messenger-attachment-paste', {
    autorun: false,
    steps: [
        {
            id: 0,
            element: () => attachmentRef.value,
            popover: {
                title: 'Копирование файлов в форму',
                description:
                    'Теперь вы можете вставлять сюда файлы с компьютера с помощью Ctrl C/Ctrl V. Например, вы можете сделать скриншот, потом нажать Ctrl V в этом окне. Фотография автоматически вставится в форму.',
                side: 'top',
                align: 'center'
            }
        }
    ]
});
</script>
