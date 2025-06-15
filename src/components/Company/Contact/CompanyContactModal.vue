<template>
    <Modal
        @close="$emit('close')"
        show
        :title="contact.isMain ? 'Основной контакт' : 'Контакт'"
        width="800"
    >
        <CompanyContactItem
            @start-editing="$emit('start-editing')"
            @create-comment="createContactComment"
            @delete-contact="$emit('delete-contact')"
            @disable="$emit('disable')"
            @enable="$emit('enable')"
            :contact="contact"
            :read-only="readOnly"
        />
    </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import { inject } from 'vue';

defineEmits(['close', 'start-editing', 'delete-contact', 'disable', 'enable']);
const createContactComment = inject('createContactComment');

defineProps({
    contact: {
        type: Object,
        required: true
    },
    readOnly: {
        type: Boolean,
        default: false
    }
});
</script>
