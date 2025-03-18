<template>
    <Modal
        @close="close"
        :show="opened"
        title="Загрузка файлов и изображений"
        class="modal-messenger-attachment"
        width="1200"
    >
        <div class="messenger-attachment">
            <UiForm>
                <FileInput
                    v-model:native="form.fileList"
                    v-model:data="form.files"
                    label="Файлы или фотографии"
                />
            </UiForm>
            <div class="messenger-attachment__footer">
                <MessengerButton @click="submit" color="success">Сохранить</MessengerButton>
                <MessengerButton @click="close" color="danger">Отмена</MessengerButton>
            </div>
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

export default {
    name: 'MessengerAttachment',
    components: { UiForm, MessengerButton, FileInput, Modal },
    mixins: [AsyncModalMixin],
    emits: ['close'],
    data() {
        return {
            form: {
                fileList: [],
                files: []
            }
        };
    },
    watch: {
        opened(value) {
            if (value) this.form = { fileList: [], files: [] };
        }
    },
    methods: {
        submit() {
            this.resolve(this.form);
        }
    }
};
</script>
