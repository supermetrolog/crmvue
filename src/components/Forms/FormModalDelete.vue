<template>
    <Modal @close="$emit('close')" show :title="title" class="modal-form-delete" width="600">
        <Form @submit.prevent="onSubmit" class="form-delete">
            <div class="form-delete__body">
                <p class="form-delete__text">
                    Вы уверены, что хотите удалить {{ text }} без возможности восстановления?
                </p>
                <i class="form-delete__icon fa-solid" :class="icon"></i>
            </div>
            <div class="form-delete__actions">
                <Button @click="$emit('delete')" class="form-delete__action" danger
                    >Удалить {{ text }}</Button
                >
                <Button @click="$emit('close')" class="form-delete__action">Отменить</Button>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { FormMixin } from '@/components/Forms/mixins.js';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
export default {
    name: 'FormModalDelete',
    components: {
        Button,
        Modal
    },
    mixins: [FormMixin],
    emits: ['close', 'delete'],
    props: {
        icon: {
            type: String,
            default: 'fa-triangle-exclamation'
        },
        text: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: 'Подтверждение удаления'
        }
    }
};
</script>

<style></style>
