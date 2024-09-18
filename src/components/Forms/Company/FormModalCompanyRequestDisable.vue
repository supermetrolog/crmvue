<template>
    <Modal @close="$emit('close')" :show="show" width="550" :title="title">
        <FormCompanyRequestDisable @disabled="$emit('disabled')" :request_id="request_id" />
    </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue';
import FormCompanyRequestDisable from '@/components/Forms/Company/FormCompanyRequestDisable.vue';

defineEmits(['close', 'disabled']);
defineProps({
    title: {
        type: String,
        default: 'Завершения запроса'
    },
    request_id: {
        type: Number,
        required: true
    },
    show: {
        type: Boolean,
        default: true
    }
});
</script>
