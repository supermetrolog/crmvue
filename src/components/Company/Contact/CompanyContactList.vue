<template>
    <div ref="listElement" @wheel.prevent class="company-contact-list">
        <CompanyContactItem
            v-for="contact of contacts"
            :key="contact.id"
            @start-editing="$emit('start-editing', $event)"
            @create-comment="createComment"
            @delete-contact="deleteContact"
            :read-only="readOnly"
            :contact
        />
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useTemplateRef } from 'vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';

const emit = defineEmits(['start-editing', 'created-comment', 'deleted']);
defineProps({
    contacts: {
        type: Array,
        default: () => []
    },
    readOnly: {
        type: Boolean,
        default: false
    }
});

const listElement = useTemplateRef('listElement');

useHorizontalScroll(listElement);

const store = useStore();
const { confirm } = useConfirm();

async function createComment(payload) {
    const created = await store.dispatch('CREATE_CONTACT_COMMENT', payload);
    if (created) emit('created-comment');
}

async function deleteContact(contact) {
    const confirmed = await confirm(
        'Удалить контакт',
        'Вы уверены, что хотите удалить контакт "' + contact.full_name + '"?'
    );

    if (!confirmed) return;

    const deleted = await store.dispatch('DELETE_CONTACT', contact);
    if (deleted) emit('deleted');
}
</script>
