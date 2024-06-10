<template>
    <Modal
        @close="$emit('close')"
        :title="contact.isMain ? 'Основной контакт' : 'Контакт'"
        width="800"
    >
        <CompanyContactItem
            @start-editing="$emit('start-editing')"
            @create-comment="createComment"
            :contact="contact"
            :read-only="readOnly"
        />
    </Modal>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';

export default {
    name: 'CompanyContactModal',
    components: {
        CompanyContactItem,
        Modal
    },
    emits: ['close', 'start-editing'],
    inject: ['createContactComment'],
    props: {
        contact: {
            type: Object,
            required: true
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        createComment(options) {
            this.createContactComment(options);
        }
    }
};
</script>
