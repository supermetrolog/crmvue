<template>
    <Modal @close="$emit('close')" width="550" :title="title">
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
        default: 'Завершение запроса'
    },
    request_id: {
        type: Number,
        required: true
    }
});
</script>
