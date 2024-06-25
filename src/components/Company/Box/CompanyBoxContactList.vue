<template>
    <div>
        <div class="company-box-main__subtitle mb-2">
            <strong>Контакты</strong>
            <HoverActionsButton @click="$emit('create')" small label="Создать контакт">
                <i class="fa-solid fa-plus" />
            </HoverActionsButton>
        </div>
        <div class="company-box-main__contacts">
            <CompanyBoxContactListItem
                v-for="contact in contacts"
                :key="contact.id"
                @click="show(contact)"
                :contact="contact"
            />
        </div>
    </div>
</template>

<script>
import CompanyBoxContactListItem from './CompanyBoxContactListItem.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'CompanyBoxContactList',
    components: {
        HoverActionsButton,
        CompanyBoxContactListItem
    },
    emits: ['create'],
    inject: ['openContact'],
    props: {
        contacts: {
            type: Array,
            required: true
        }
    },
    methods: {
        show(contact) {
            this.openContact(contact);
        }
    }
};
</script>
