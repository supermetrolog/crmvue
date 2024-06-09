<template>
    <div class="company-contact-list">
        <CompanyContactItem
            v-for="contact of contacts"
            :key="contact.id"
            @start-editing="$emit('start-editing', $event)"
            @create-comment="createComment"
            @delete-contact="deleteContact"
            :contact="contact"
            :read-only="readOnly"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'CompanyContactList',
    components: {
        CompanyContactItem
    },
    emits: ['start-editing', 'created-comment', 'deleted'],
    props: {
        contacts: {
            type: Array,
            default: () => []
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    methods: {
        ...mapActions(['DELETE_CONTACT', 'CREATE_CONTACT_COMMENT']),
        async createComment(data) {
            await this.CREATE_CONTACT_COMMENT(data);
            this.$emit('created-comment');
        },
        async deleteContact(contact) {
            const confirmed = await this.confirm(
                'Вы уверены, что хотите удалить контакт ' + contact.header + '?'
            );

            if (confirmed) {
                await this.DELETE_CONTACT(this.deletingContact);
                this.$emit('deleted');
            }
        }
    }
};
</script>

<style></style>
