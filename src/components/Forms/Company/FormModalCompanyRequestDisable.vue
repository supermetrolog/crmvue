<template>
    <div class="modal-form-company-request-disable">
        <Modal @close="$emit('close')" class="autosize" :title="title">
            <FormCompanyRequestDisable @disabled="$emit('disabled')" :request_id="request_id" />
        </Modal>
    </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import FormCompanyRequestDisable from '@/components/Forms/Company/FormCompanyRequestDisable.vue';

export default {
    name: 'FormModalCompanyRequestDisable',
    components: {
        FormCompanyRequestDisable,
        Modal
    },
    emits: ['close', 'disabled'],
    props: {
        title: {
            type: String,
            default: 'Завершения запроса'
        },
        request_id: {
            type: Number,
            required: true
        }
    }
};
</script>