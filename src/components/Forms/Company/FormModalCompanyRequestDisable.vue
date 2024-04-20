<template>
    <Modal @close="$emit('close')" width="550" :title="title">
        <FormCompanyRequestDisable @disabled="$emit('disabled')" :request_id="request_id" />
    </Modal>
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
